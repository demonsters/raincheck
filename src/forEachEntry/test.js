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

  it('should work when selector has given as defaultValue', () => {
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


})
