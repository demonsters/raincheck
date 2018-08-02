// @flow

import forEachEntry from '.'

describe('forEachEntry()', () => {

  it('should work with do function chaining', () => {
    const start = jest.fn();
    const t = forEachEntry().do(start)
    t({key: 'element1'})
    t({key: 'element'})
    expect(start).toHaveBeenCalledTimes(1)
  })
  
  it('should call changed when using do function', () => {
    const start = jest.fn();
    const changed = jest.fn();
    // type State = {
    //   name: string,
    //   id: number
    // }
    const object1 = {name: 'object1', id: 1}
    const object2 = {name: 'object2', id: 1}
    const recheck = forEachEntry().do(start, changed)
    recheck({key: object1})
    recheck({key: object2})
    expect(start).toHaveBeenCalledTimes(1)
    expect(changed).toHaveBeenCalledTimes(1)
  })

  it('should work when selector has given', () => {
    const start = jest.fn();
    type ValueState = {
      [key: string]: string
    }
    type State = {
      value: ValueState
    }

    const tester = forEachEntry((s: State): ValueState => s.value).do(start)

    const obj1 = "object 1"
    tester({
      value: {
        key: obj1 }
      });
    expect(start).toBeCalledWith(obj1, expect.anything());
  })


  it('should call changed when using do options', () => {
    const start = jest.fn();
    const changed = jest.fn();
    // type State = {
    //   name: string,
    //   id: number
    // }
    const object1 = {name: 'object1', id: 1}
    const object2 = {name: 'object2', id: 1}
    const recheck = forEachEntry({
      do: start,
      changed
    })
    recheck({key: object1})
    recheck({key: object2})
    expect(start).toHaveBeenCalledTimes(1)
    expect(changed).toHaveBeenCalledTimes(1)
  })


  it('should pass down rest arguments', () => {

    const start = jest.fn()
    const changed = jest.fn()
    const deleted = jest.fn()
    const arg1 = {}
    const arg2 = {}
    let check = forEachEntry({
      do: (...args) => {
        start(...args)
        return deleted
      },
      changed
    })

    check({key: 'one'}, arg1, arg2)
    check({key: 'one2'}, arg1, arg2)
    check({}, arg2, arg1)

    expect(start).toBeCalledWith("one", expect.anything(), arg1, arg2);
    expect(changed).toBeCalledWith("one2", "one", expect.anything(), arg1, arg2);
    expect(deleted).toBeCalledWith(arg2, arg1);

  })

})
