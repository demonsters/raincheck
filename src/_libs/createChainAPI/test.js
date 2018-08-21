// flow

import createNext from '.'

describe('createNext', () => {

  it('Should call 2 next actions', () => {

    const listener1 = jest.fn()
    const listener2 = jest.fn()

    let asyncCompleteHandler

    const creator = (next) => {
      asyncCompleteHandler = () => next(listener1, listener2)
      // return () => )
    }

    const destruct = createNext(creator)
    asyncCompleteHandler()

    expect(listener1).toHaveBeenCalledTimes(1)
    expect(listener2).toHaveBeenCalledTimes(1)
  })

  it('Should chain to second function', () => {

    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    let nextHandler

    const doTest1 = (next) => {
      firstStart()
      nextHandler = () => next(doTest2)
      return firstEnd
    }

    const doTest2 = () => {
      secondStart()
      return secondEnd
    }

    const destruct = createNext(doTest1)
    expect(firstStart).toBeCalled()

    nextHandler()

    expect(secondStart).toBeCalled()

    destruct()
    destruct()

    expect(secondEnd).toHaveBeenCalledTimes(1)
    expect(firstEnd).not.toBeCalled()

  })


  xit('Should prevent next being called twice', () => {

    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    let nextHandler

    const doTest1 = (next) => {
      firstStart()
      nextHandler = () => next(doTest2)
      return firstEnd
    }

    const doTest2 = () => {
      secondStart()
      return secondEnd
    }

    const destruct = createNext(doTest1)
    expect(firstStart).toBeCalled()

    nextHandler()
    nextHandler()

    expect(secondStart).toBeCalled()

    destruct()
    destruct()

    expect(secondEnd).toHaveBeenCalledTimes(1)
    expect(firstEnd).not.toBeCalled()

  })

  it('Should complex', () => {

    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    const secondStart_1 = jest.fn();
    const secondEnd_1 = jest.fn();

    const thirdStart = jest.fn();
    const thirdEnd = jest.fn();

    let nextHandler1
    let nextHandler2

    const doTest1 = (next) => {
      firstStart()
      nextHandler1 = () => next(doTest2, doTest2_1)
      return firstEnd
    }

    const doTest2 = (next) => {
      secondStart()
      nextHandler2 = () => next(doTest3)
      return secondEnd
    }

    const doTest2_1 = (next) => {
      secondStart_1()
      return secondEnd_1
    }

    const doTest3 = () => {
      thirdStart()
      return thirdEnd
    }

    const destruct = createNext(doTest1)
    expect(firstStart).toBeCalled()

    nextHandler1()

    expect(secondStart).toBeCalled()

    nextHandler2()

    destruct()
    destruct()

    expect(secondStart_1).toHaveBeenCalledTimes(1)
    expect(secondEnd_1).toHaveBeenCalledTimes(1)

    expect(thirdStart).toHaveBeenCalledTimes(1)
    expect(thirdEnd).toHaveBeenCalledTimes(1)

    expect(firstEnd).not.toBeCalled()
    expect(secondEnd).not.toBeCalled()

  })

  it('Should destruct when resolve is called', () => {

    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    let nextHandler1
    let nextHandler2

    const doTest1 = (next) => {
      firstStart()
      nextHandler1 = () => next(doTest2)
      return firstEnd
    }

    const doTest2 = (next) => {
      secondStart()
      nextHandler2 = () => next.resolve()
      return secondEnd
    }

    const destruct = createNext(doTest1)
    expect(firstStart).toBeCalled()

    nextHandler1()

    expect(secondStart).toBeCalled()

    nextHandler2()

    destruct()
    destruct()
    expect(firstEnd).not.toBeCalled()

    expect(secondEnd).not.toBeCalled()

  })


  it('Should destruct when next is called with no arguments is called', () => {

    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    let nextHandler1
    let nextHandler2

    const doTest1 = (next) => {
      firstStart()
      nextHandler1 = () => next(doTest2)
      return firstEnd
    }

    const doTest2 = (next) => {
      secondStart()
      nextHandler2 = () => next()
      return secondEnd
    }

    const destruct = createNext(doTest1)
    expect(firstStart).toBeCalled()

    nextHandler1()

    expect(secondStart).toBeCalled()

    nextHandler2()

    destruct()
    destruct()
    expect(firstEnd).not.toBeCalled()

    expect(secondEnd).not.toBeCalled()

  })


  it('Should destruct when calling branch', () => {

    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    let nextHandler

    const doTest1 = (next) => {
      firstStart()
      nextHandler = () => next.branch(doTest2)
      return firstEnd
    }

    const doTest2 = () => {
      secondStart()
      return secondEnd
    }

    const destruct = createNext(doTest1)
    expect(firstStart).toBeCalled()

    nextHandler()

    expect(secondStart).toBeCalled()

    destruct()
    destruct()
    expect(firstEnd).toBeCalled()

    expect(secondStart).toHaveBeenCalledTimes(1)
    expect(secondEnd).toHaveBeenCalledTimes(1)

  })




  it('Should not call destruct when its resolved before destructed', () => {

    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    let nextHandler
    let nextHandler2

    const doTest1 = (next) => {
      firstStart()
      nextHandler = () => next.branch(doTest2)
      return firstEnd
    }

    const doTest2 = (next) => {
      secondStart()
      nextHandler2 = () => next.resolve()
      return secondEnd
    }

    const destruct = createNext(doTest1)

    nextHandler()
    nextHandler2()
    
    expect(firstEnd).not.toHaveBeenCalled()

    destruct()
    destruct()

    expect(secondStart).toHaveBeenCalled()
    expect(secondEnd).not.toHaveBeenCalled()

  })


})
