// @flow

import generate, {withMockFunctions} from '.'

const getTester = (connectToSocket) => generate(
  state => ({
    isLoggedIn: state.isLoggedIn,
    url: state.url,
    test: state.test
  }),

  ({isLoggedIn, url}, call) => {
    if (isLoggedIn && url) {
      call(connectToSocket, [url], url)
    }
  }
)

describe('generate', () => {

  it('should call destructor once', () => {

    const connectToSocket = jest.fn()

    const tester = getTester(connectToSocket)

    const url = "dfgh"
    const state = {
      isLoggedIn: true,
      url
    }

    tester(state)
    tester(state)
    expect(connectToSocket).toBeCalledWith(url, expect.anything())
    expect(connectToSocket).toHaveBeenCalledTimes(1)

  })


  it('should call check function once when state is not changed', () => {

    const checker = jest.fn()

    const tester = generate(

      state => ({
        isLoggedIn: state.isLoggedIn,
        url: state.url
      }),

      ({isLoggedIn, url}, call) => {
        checker()
      }
    )

    const url = "dfgh"
    const state = {
      isLoggedIn: true,
      url
    }

    tester(state)
    tester(state)
    expect(checker).toHaveBeenCalledTimes(1)

  })


  it('should call check function when state is changed', () => {

    const checker = jest.fn()

    const tester = generate(

      state => ({
        isLoggedIn: state.isLoggedIn,
        url: state.url
      }),

      ({isLoggedIn, url}, call) => {
        checker()
      }
    )

    const url = "dfgh"
    const state = {
      isLoggedIn: true,
      url
    }

    tester(state)

    const newState = {
      isLoggedIn: false,
      url
    }

    tester(newState)

    expect(checker).toHaveBeenCalledTimes(2)

  })


  it('should be able to unit test it easily by injecting the call function', () => {

    const connectToSocket = () => {}

    let tester = getTester(connectToSocket)

    const listener = jest.fn()
    const destruct = jest.fn()
    tester = withMockFunctions(tester, listener, destruct)

    const url = "dfgh"
    tester({
      isLoggedIn: true,
      url
    })
    expect(listener).toBeCalledWith(connectToSocket, [url], expect.anything())
    expect(destruct).not.toBeCalled()
    tester({
      isLoggedIn: false,
      url
    })
    expect(destruct).toBeCalled()

  })


  it('should destruct function when not called anymore', () => {

    const destruct = jest.fn()
    const connectToSocket = () => destruct

    const tester = getTester(connectToSocket)

    tester({
      isLoggedIn: true,
      url: "dfgh"
    })

    tester({
      isLoggedIn: false,
      url: "dfgh"
    })

    expect(destruct).toBeCalled()

  })


  it('should not destruct function when something unrelated changed', () => {

    const destruct = jest.fn()
    const connectToSocket = () => destruct

    const tester = getTester(connectToSocket)

    tester({
      isLoggedIn: true,
      url: "dfgh1",
      test: 1
    })

    tester({
      isLoggedIn: true,
      url: "dfgh1",
      test: 2
    })

    expect(destruct).not.toBeCalled()

  })


  it('should work with arrays', () => {

      const start = jest.fn();
      const end = jest.fn();

      const func = (...args) => {
        start(...args)
        return end
      }

      const tester = generate(s => s, (array, call) => {
        array.forEach(key => call(func, [key], key) )
      })

      const obj1 = "object 1"
      const obj2 = "object 2"

      // Start obj1
      tester([obj1])
      tester([obj1])
      expect(start).toBeCalledWith(obj1, expect.anything())

      // Start obj2
      tester([obj1, obj2])
      tester([obj1, obj2])
      expect(start).toBeCalledWith(obj2, expect.anything())

      // End obj1
      tester([obj2])
      tester([obj2])
      expect(end).toBeCalled()

      // End obj2
      tester([])
      expect(end).toBeCalled()

      expect(start).toHaveBeenCalledTimes(2)
      expect(end).toHaveBeenCalledTimes(2)

    })



})
