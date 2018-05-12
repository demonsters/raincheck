// @flow

import forEach from '.'
import type { ChainAPI } from '../index';

describe('forEach()', () => {

  it('should work when given constructor as option do', () => {
    const start = jest.fn();
    forEach(['element'], {
      do: start
    })

    expect(start).toHaveBeenCalledTimes(1)
  })

  it('should work when given constructor as function option', () => {
    const start = jest.fn();
    forEach(['element'], () => start())

    expect(start).toHaveBeenCalledTimes(1)
  })

  it('should work with key extractor', () => {
    const start = jest.fn();
    const element = {name: 'element', id: 1}
    forEach([element], {
      do: start,
      keyExtractor: s => s.id
    })

    expect(start).toBeCalledWith(element, expect.anything())
  })


  it('should call changed', () => {

    const start = jest.fn();
    const changed = jest.fn();
    const obj1 = {name: "obj1", id: 1}
    const obj2 = {name: "obj2", id: 1}
    const tester = forEach([obj1], {
      do: start,
      changed,
      keyExtractor: s => s.id
    })

    // Start obj1
    tester([obj2])

    expect(changed).toBeCalledWith(obj2, obj1, 1)

    tester([])

    expect(changed).toHaveBeenCalledTimes(1)

  })

})
