// @flow

import doWhen from '.'

type Props = {
  isLoggedIn: boolean,
  url: string,
}

type State = {
  isLoggedIn: boolean,
  url: string,
  test?: number
}

const getTester = (connectToSocket: (props: Props) => any) => doWhen(
  ({isLoggedIn, url}: State, call) => {
    if (isLoggedIn && url) {
      call(connectToSocket, url)
    }
  }
)

describe('doWhen', () => {

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

    const tester = doWhen(
      ({isLoggedIn, url}, call) => {
        checker()
      }
    ).map(state => ({
      isLoggedIn: state.isLoggedIn,
      url: state.url
    }))

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

    const tester = doWhen(
      ({isLoggedIn, url}, call) => {
        checker()
      }
    ).map(state => ({
      isLoggedIn: state.isLoggedIn,
      url: state.url
    }))

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


  it('should NOT destruct function when something unrelated changed', () => {

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

    const tester = doWhen((array, call) => {
      array.forEach(key => call(func, key) )
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

  // This is unexpected behaviour
  xit('should pick the first argument (if is string) as key of no key is given', () => {

    const start = jest.fn();
    const end = jest.fn();

    const func = (...args) => {
      start(...args)
      return end
    }

    const tester = doWhen((key, call) => {
      call(func, key)
    })

    tester("key1")
    expect(start).toHaveBeenCalledTimes(1)

    tester("key2")
    expect(start).toHaveBeenCalledTimes(2)
  })

  it('should take the args as key if not a array', () => {

    const start = jest.fn();
    const end = jest.fn();

    const func = (...args) => {
      start(...args)
      return end
    }

    const tester = doWhen((key, call) => {
      call(func, key)
    })

    tester("key1")
    expect(start).toBeCalledWith("key1", expect.anything())
    expect(start).toHaveBeenCalledTimes(1)

    tester("key2")
    expect(start).toBeCalledWith("key2", expect.anything())
    expect(start).toHaveBeenCalledTimes(2)

  })

  describe('mock()', () => {

    it('should be able to mock it easily', () => {

      const connectToSocket = () => {}

      const listener = jest.fn()
      const destruct = jest.fn()

      let tester = getTester(connectToSocket).mock(listener, destruct)

      const url = "dfgh"
      tester({
        isLoggedIn: true,
        url
      })
      expect(listener).toBeCalledWith(connectToSocket, url, expect.anything())
      expect(destruct).not.toBeCalled()
      tester({
        isLoggedIn: false,
        url
      })
      expect(destruct).toBeCalled()

    })

    // it('should be able to')


    it('should work when with if called befere mock', () => {
      const start = jest.fn();

      const listener = jest.fn()
      const destruct = jest.fn()

      const tester = doWhen(start)
        .map(s => s.value)
        .mock(listener, destruct)

      const obj1 = "object 1"
      tester({ value: obj1 });
      expect(start).toBeCalledWith(obj1, expect.anything());
    })

    it('should work when value is not an object', () => {
      const start = jest.fn();

      const listener = jest.fn()
      const destruct = jest.fn()

      const tester = doWhen(start)
        .mock(listener, destruct)

      tester(true);
      expect(start).toBeCalled();
    })

  })

  describe("map()", () => {
    it("should called with object", () => {
      const start = jest.fn();
      const tester = doWhen(start).map(s => s.value);

      const obj1 = "object 1"
      tester({ value: obj1 });
      expect(start).toBeCalledWith(obj1, expect.anything());
    });
  });

})
