
import doWhenChanged from '.'

describe('doWhenChanged()', () => {

  const setup = () => {
    const changed = jest.fn();
    const end = jest.fn();
    const tester = doWhenChanged(s => s, (...args) => {
      changed(...args)
      return end
    })

    return {
      changed,
      tester,
      end
    }
  }

  it('should work with numbers', () => {

    const {changed, end,tester} = setup()

    tester(1)
    expect(changed).toBeCalledWith(1, undefined, expect.anything())

    tester(2)
    expect(changed).toBeCalledWith(2, 1, expect.anything())
    expect(end).toBeCalled()

    expect(changed).toHaveBeenCalledTimes(2)
    expect(end).toHaveBeenCalledTimes(1)

  })

  it('should work with strings', () => {

    const {changed,tester, end} = setup()

    tester("string1")
    expect(changed).toBeCalledWith("string1", undefined, expect.anything())

    tester("string2")
    expect(changed).toBeCalledWith("string2", "string1", expect.anything())
    expect(end).toBeCalled()

    expect(changed).toHaveBeenCalledTimes(2)
    expect(end).toHaveBeenCalledTimes(1)

  })


  it('should cancel next', () => {

    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    let nextHandler

    const firstActor = (newValue, oldValue, next) => {
      firstStart()
      nextHandler = () => next(secondActor())
      return firstEnd
    }

    const secondActor = () => {
      secondStart()
      return secondEnd
    }

    const tester = doWhenChanged(s => s, firstActor)

    tester("string1")
    expect(firstStart).toBeCalled()

    nextHandler()

    expect(secondStart).toBeCalled()

    tester(undefined)

    expect(secondEnd).toHaveBeenCalledTimes(1)
    expect(firstEnd).not.toBeCalled()

  })


})

