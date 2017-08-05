
import doForAllKeys from '.'

describe('doForAllKeys()', () => {

  it('should work with arrays', () => {

    const start = jest.fn();
    const end = jest.fn();

    const tester = doForAllKeys(s => s, (...args) => {
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

    const doTest1 = (string, next) => {
      firstStart()
      nextHandler = () => next(doTest2())
      return firstEnd
    }

    const doTest2 = () => {
      secondStart()
      return secondEnd
    }

    const tester = doForAllKeys(s => s, doTest1)

    tester(["string"])
    expect(firstStart).toBeCalled()

    nextHandler()

    expect(secondStart).toBeCalled()

    tester([])

    expect(secondEnd).toHaveBeenCalledTimes(1)
    expect(firstEnd).not.toBeCalled()

  })


})
