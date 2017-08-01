
import doForAll from '.'

describe('doForAll()', () => {

  const setup = () => {
    const start = jest.fn();
    const end = jest.fn();
    const changed = jest.fn();

    const tester = doForAll(s => s, (...args) => {
      start(...args)
      return () => end(...args)
    }, changed)

    return {
      start,
      end,
      changed,
      tester
    }
  }

  it('should call when start and stopped', () => {

    const { start, end, tester } = setup()

    const obj1 = {name: "object 1"}
    const obj2 = {name: "object 2"}

    // Start obj1
    tester({obj1})
    tester({obj1})
    expect(start).toBeCalledWith(obj1, expect.anything())

    // Start obj2
    tester({obj1, obj2})
    tester({obj1, obj2})
    expect(start).toBeCalledWith(obj2, expect.anything())

    // End obj1
    tester({obj2})
    tester({obj2})
    expect(end).toBeCalledWith(obj1, expect.anything())

    // End obj2
    tester({})
    expect(end).toBeCalledWith(obj2, expect.anything())

    expect(start).toHaveBeenCalledTimes(2)
    expect(end).toHaveBeenCalledTimes(2)

  })


  it('null & false should stop all', () => {

    const { start, end, tester } = setup()

    const obj1 = {name: "object 1"}
    const obj2 = {name: "object 2"}

    tester({obj1, obj2})
    expect(start).toBeCalledWith(obj1, expect.anything())
    expect(start).toBeCalledWith(obj2, expect.anything())

    // End obj2
    tester(false)
    expect(end).toBeCalledWith(obj1, expect.anything())
    expect(end).toBeCalledWith(obj2, expect.anything())

    tester({obj1, obj2})
    expect(start).toBeCalledWith(obj1, expect.anything())
    expect(start).toBeCalledWith(obj2, expect.anything())

    tester(null)
    expect(end).toBeCalledWith(obj1, expect.anything())
    expect(end).toBeCalledWith(obj2, expect.anything())

    expect(start).toHaveBeenCalledTimes(4)
    expect(end).toHaveBeenCalledTimes(4)

  })

  it('should call changed', () => {

    const { changed, tester } = setup()

    const obj1 = {name: "obj1"}
    const obj2 = {name: "obj2"}

    // Start obj1
    tester({obj1})

    tester({obj1: obj2})
    tester({obj1: obj2})
    expect(changed).toBeCalledWith(obj2, obj1)

    tester({})

    expect(changed).toHaveBeenCalledTimes(1)

  })


  it('should work when no destruct function is returned', () => {
    const start = jest.fn();

    const tester = doForAll((...args) => {
      start(...args)
    })

    tester(["test"])
    tester(null)
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

    const tester = doForAll(s => s, doTest1)

    tester({key: "string"})
    expect(firstStart).toBeCalled()

    nextHandler()

    expect(secondStart).toBeCalled()

    tester(false)

    expect(secondEnd).toHaveBeenCalledTimes(1)
    expect(firstEnd).not.toBeCalled()

  })



})
