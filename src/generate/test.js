
import generate from '.'

describe('generate', () => {

  it('should call destructor once', () => {

    const connectToSocket = jest.fn()

    const tester = generate(

      state => ({
        isLoggedIn: state.isLoggedIn,
        url: state.url
      }),

      ({isLoggedIn, url}, call) => {
        if (isLoggedIn && url) {
          call(connectToSocket, [url], url)
        }
      }
    )

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

    const tester = generate(

      state => ({
        isLoggedIn: state.isLoggedIn,
        url: state.url
      }),

      ({isLoggedIn, url}, call) => {
        if (isLoggedIn && url) {
          call(connectToSocket, [url], url)
        }
      }
    )

    const url = "dfgh"
    const state = {
      isLoggedIn: true,
      url
    }

    const listener = jest.fn()
    tester(state, listener)
    expect(listener).toBeCalledWith(connectToSocket, [url], expect.anything())

  })


  it('should destruct function when not called anymore', () => {

    const destruct = jest.fn()
    const connectToSocket = () => destruct

    const tester = generate(

      state => ({
        isLoggedIn: state.isLoggedIn,
        url: state.url
      }),

      ({isLoggedIn, url}, call) => {
        if (isLoggedIn && url) {
          call(connectToSocket, [url], url)
        }
      }
    )

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

    const tester = generate(

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


})
