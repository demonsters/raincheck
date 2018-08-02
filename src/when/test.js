
import when from '.'

describe('when()', () => {

  const setup = () => {
    const changed = jest.fn();
    const end = jest.fn();
    const tester = when().do((...args) => {
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
    expect(changed).toBeCalledWith(1, expect.anything())

    tester(2)
    expect(changed).toBeCalledWith(2, expect.anything())
    expect(end).toBeCalled()

    expect(changed).toHaveBeenCalledTimes(2)
    expect(end).toHaveBeenCalledTimes(1)

  })

  it('should work with strings', () => {

    const {changed,tester, end} = setup()

    tester("string1")
    expect(changed).toBeCalledWith("string1", expect.anything())

    tester("string2")
    expect(changed).toBeCalledWith("string2", expect.anything())
    expect(end).toBeCalled()

    expect(changed).toHaveBeenCalledTimes(2)
    expect(end).toHaveBeenCalledTimes(1)

  })


  it("should work with boolean", () => {

    const start = jest.fn();
    const end = jest.fn();

    const tester = when().do((...args) => {
      start(...args);
      return () => end(...args);
    });

    tester(true);
    expect(start).toBeCalled();
    tester(true);

    tester(false);
    expect(start).toBeCalled();
    tester(false);

    tester(true);
    expect(start).toBeCalled();
    tester(true);

    expect(start).toHaveBeenCalledTimes(2);
    expect(end).toHaveBeenCalledTimes(1);
  });



  it('should cancel next', () => {

    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    let nextHandler

    const firstActor = (newValue, next) => {
      firstStart()
      nextHandler = () => next(secondActor)
      return firstEnd
    }

    const secondActor = () => {
      secondStart()
      return secondEnd
    }

    const tester = when().do(firstActor)

    tester("string1")
    expect(firstStart).toBeCalled()

    nextHandler()

    expect(secondStart).toBeCalled()

    tester(undefined)

    expect(secondEnd).toHaveBeenCalledTimes(1)
    expect(firstEnd).not.toBeCalled()

  })

  describe('map()', () => {

      it('should work', () => {
        let {changed, tester} = setup()
        tester = tester.map(s => s.value)
        tester({value: 1})
        expect(changed).toBeCalledWith(1, expect.anything())
      })

  })


  describe("mock()", () => {

    it('should be testable', () => {

      const user1 = { name: "user 1" }
      const user2 = { name: "user 2" }

      const spy = jest.fn()
      const changed = () => {}
      const tester = when().do(changed).mock(spy)

      tester(user1)
      expect(spy).toBeCalledWith(changed, user1)

      tester(user2)

      expect(spy).toBeCalledWith(changed, user2)

    })
  })


  it('should not overflow when called recursive', () => {

    const obj1 = {name: "obj1", id: 1}
    let i = 0
    let doCheck

    const doFunc = () => {
      i++
      if (i > 1) {
        throw new Error('Recursive error')
      }
      doCheck(obj1)
    }

    doCheck = when().do(doFunc)

    doCheck(obj1)

    expect(i).toBe(1)

  })


  it('should work when selector has given as defaultValue', () => {
    const start = jest.fn();

    const tester = when(s => s.value).do(start)

    const obj1 = "object 1"
    tester({ value: obj1 });
    expect(start).toBeCalledWith(obj1, expect.anything());
  })

  it('should work with options', () => {
    const start = jest.fn();

    const tester = when({
      do: start
    })

    const obj1 = "object 1"
    tester(obj1);
    expect(start).toBeCalledWith(obj1, expect.anything());
  })

  it('should pass down rest arguments', () => {

    const changed = jest.fn()
    const arg1 = {}
    const arg2 = {}
    let check = when({
      do: changed
    })

    check(true, arg1, arg2)

    expect(changed).toBeCalledWith(true, expect.anything(), arg1, arg2);

  })
})

