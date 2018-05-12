// @flow

import doForAllKeys from '.'
import {ChainAPI} from '../_libs/createChainAPI'

describe('doForAllKeys()', () => {

  it('should work with arrays', () => {

    const start = jest.fn();
    const end = jest.fn();

    const tester = doForAllKeys((...args) => {
      start(...args)
      return () => end(...args)
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
    expect(end).toBeCalledWith(obj1, expect.anything())

    // End obj2
    tester([])
    expect(end).toBeCalledWith(obj2, expect.anything())

    expect(start).toHaveBeenCalledTimes(2)
    expect(end).toHaveBeenCalledTimes(2)

  })


  it('should cancel next', () => {

    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    let nextHandler

    const doTest1 = (string: string, next: ChainAPI) => {
      firstStart()
      nextHandler = () => next(doTest2)
      return firstEnd
    }

    const doTest2 = () => {
      secondStart()
      return secondEnd
    }

    const tester = doForAllKeys(doTest1)

    tester(["string"])
    expect(firstStart).toBeCalled()

    if (nextHandler) {
      nextHandler()
    }

    expect(secondStart).toBeCalled()

    tester([])

    expect(secondEnd).toHaveBeenCalledTimes(1)
    expect(firstEnd).not.toBeCalled()

  })


  describe("map()", () => {
    it("should called", () => {
      const start = jest.fn();
      const tester = doForAllKeys(start).map(s => s.value);

      const obj1 = "object 1"
      tester({ value: [obj1] });
      expect(start).toBeCalledWith(obj1, expect.anything());
    });
  });


  describe("mock()", () => {

    it('should be testable', () => {

      type State = {
        loggedUsers: Array<string>,
        userName: string
      }

      const state = {
        loggedUsers: ["1", "2"]
      }

      const sendLogin = (userId: string) => {}

      const spy = jest.fn()
      let tester = doForAllKeys(sendLogin)
        .map((s: State) => s.loggedUsers)
        .mock(spy)

      tester(state)

      expect(spy).toBeCalledWith(sendLogin, "1")
      expect(spy).toBeCalledWith(sendLogin, "2")

    })
  })

})
