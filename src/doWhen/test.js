
import doWhen from '.'

describe('doWhen()', () => {

  it('should work with true & false', () => {

    const start = jest.fn();
    const end = jest.fn();

    const TestActor = doWhen(s => s, (...args) => {
      start(...args)
      return end
    })

    TestActor(true)
    expect(start).toBeCalled()
    TestActor(true)

    TestActor(false)
    expect(end).toBeCalled()
    TestActor(false)

    expect(start).toHaveBeenCalledTimes(1)
    expect(end).toHaveBeenCalledTimes(1)
  })


  it('should cancel next', () => {

    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    let nextHandler

    const firstActor = (next) => {
      firstStart()
      nextHandler = () => next(secondActor)
      return firstEnd
    }

    const secondActor = () => {
      secondStart()
      return secondEnd
    }

    const tester = doWhen(s => s, firstActor)

    tester(true)
    expect(firstStart).toBeCalled()

    nextHandler()

    expect(secondStart).toBeCalled()

    tester(false)

    expect(secondEnd).toHaveBeenCalledTimes(1)
    expect(firstEnd).not.toBeCalled()

  })

})
