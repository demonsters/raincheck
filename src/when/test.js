
import when from '.'

describe('when()', () => {

  const setup = () => {
    const changed = jest.fn();
    const end = jest.fn();
    const tester = when({
      do: (...args) => {
        changed(...args)
        return end
      }
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

  // TODO
  xdescribe('map()', () => {

      it('should work', () => {
        let {changed, tester} = setup()
        tester = tester.map(s => s.value)
        tester({value: 1})
        expect(changed).toBeCalledWith(1, expect.anything())
      })

  })


  // TODO: ??
  xdescribe("mock()", () => {

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
    const deleted = jest.fn()
    const arg1 = {}
    const arg2 = {}
    let check = when({
      do: (...args) => {
        changed(...args)
        return deleted
      }
    })

    check(true, arg1, arg2)
    check(false, arg2, arg1)

    expect(changed).toBeCalledWith(true, expect.anything(), arg1, arg2);
    expect(deleted).toBeCalledWith(arg2, arg1);

  })

  xit('should call changed', () => {

    const start = jest.fn();
    const changed = jest.fn();
    const obj1 = {name: "obj1", id: 1}
    const obj2 = {name: "obj2", id: 1}
    const tester = when({
      do: (item: Array<typeof obj1>) => start(item),
      changed,
      keyExtractor: s => s.id
    })

    tester(obj1)

    // Start obj1
    tester(obj2)

    expect(changed).toBeCalledWith(obj2, obj1, 1)

    tester(undefined)

    expect(changed).toHaveBeenCalledTimes(1)

  })

  
  // TODO: Choose `and` or `with`
  it('dependencies', () => {

    const start = jest.fn();
    const end = jest.fn();

    const check = when(o => o.name, {
      and: [o => o.id],
      do: (...args) => {
        start(...args)
        return end
      }
    })

    check({name: "name", id: "id"})
    check({name: "name", id: "id"})
    
    expect(start).toBeCalledWith("name", "id", expect.anything())
    expect(start).toBeCalledTimes(1)
    
    check({name: "name2", id: "id"})

    expect(end).toBeCalledWith()
    expect(end).toBeCalledTimes(1)

  })


  // it('should match multiple selectors', () => {

  //   const start = jest.fn();
  //   const end = jest.fn();

  //   const check = when([o => o.name, o => o.id], {
  //     do: (...args) => {
  //       start(...args)
  //       return end
  //     }
  //   })

  //   check({name: "name", id: "id"})
  //   check({name: "name", id: "id"})
    
  //   expect(start).toBeCalledWith("name", "id", expect.anything())
  //   expect(start).toBeCalledTimes(1)
    
  //   check({name: "name2", id: "id"})

  //   expect(end).toBeCalledWith()
  //   expect(end).toBeCalledTimes(1)

  // })


})

