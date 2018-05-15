// @flow

import forEachEntry from '.'

describe('forEachEntry()', () => {

  it('should work with do function chaining', () => {
    const start = jest.fn();
    forEachEntry({key: 'element1'}).do(start)({key: 'element'})
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


})
