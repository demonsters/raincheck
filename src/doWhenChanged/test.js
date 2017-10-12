
import doWhenChanged from '.'

describe('doWhenChanged()', () => {

  const setup = () => {
    const changed = jest.fn();
    const end = jest.fn();
    const tester = doWhenChanged((...args) => {
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

    const {changed, end, tester} = setup()

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
      nextHandler = () => next(secondActor)
      return firstEnd
    }

    const secondActor = () => {
      secondStart()
      return secondEnd
    }

    const tester = doWhenChanged(firstActor)

    tester("string1")
    expect(firstStart).toBeCalled()

    nextHandler()

    expect(secondStart).toBeCalled()

    tester(undefined)

    expect(secondEnd).toHaveBeenCalledTimes(1)
    expect(firstEnd).not.toBeCalled()

  })

  describe('with()', () => {

      it('should work', () => {
        let {changed, tester} = setup()
        tester = tester.with(s => s.value)
        tester({value: 1})
        expect(changed).toBeCalledWith(1, undefined, expect.anything())
      })

  })


  describe("mock()", () => {

    it('should be testable', () => {

      const user1 = { name: "user 1" }
      const user2 = { name: "user 2" }

      const spy = jest.fn()
      const changed = () => {}
      const tester = doWhenChanged(changed).mock(spy)

      tester(user1)
      tester(user2)

      expect(spy).toBeCalledWith(changed, user1, undefined)
      expect(spy).toBeCalledWith(changed, user2, user1)

    })
  })


})

