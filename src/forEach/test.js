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

  it('should work with do function chaining', () => {
    const start = jest.fn();
    forEach().do(start)(['element'])
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

  it('should work when the first element is an selector', () => {
    const start = jest.fn();
    type Item = {
      name: string,
      id: number
    }
    const element = {name: 'element', id: 1}
    forEach((element: Item) => [element], {
      do: start,
      keyExtractor: s => s.id
    })(element)
    expect(start).toBeCalledWith(element, expect.anything())
  })

  it('should work when the first element is an selector and do chain', () => {
    const start = jest.fn();
    type Item = {
      name: string,
      id: number
    }
    const element = {name: 'element', id: 1}
    forEach((element: Item) => [element])
      .do(start, {
        keyExtractor: s => s.id
      })(element)
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

  it('should call changed when using do function', () => {
    const start = jest.fn();
    const changed = jest.fn();
    const object1 = {name: 'object1', id: 1}
    const object2 = {name: 'object2', id: 1}
    const recheck = forEach().do((s: typeof object1) => start(), {
      changed,
      keyExtractor: s => s.id
    })
    recheck([object1])
    recheck([object2])
    expect(start).toHaveBeenCalledTimes(1)
    expect(changed).toHaveBeenCalledTimes(1)
  })

  it('should NOT call changed', () => {
    const start = jest.fn();
    const changed = jest.fn();
    const object1 = {name: 'object1', id: 1}
    const object2 = {name: 'object2', id: 2}
    const recheck = forEach().do((s: typeof object1) => start(), {
      changed,
      keyExtractor: s => s.id
    })
    recheck([object1])
    recheck([object1, object2])
    expect(start).toHaveBeenCalledTimes(2)
    expect(changed).not.toHaveBeenCalled()
  })


  describe('filter()', () => {

    it('should filter out elements', () => {
      const start = jest.fn();
      const tester = forEach().do(start, {
        keyExtractor: (item) => item.name
      })
        .filter(s => s.filter);

      const obj1 = {
        name: "object 1",
        filter: false
      }
      const obj2 = {
        name: "object 2",
        filter: true
      }
      tester([
        obj1,
        obj2
      ])
      expect(start).toHaveBeenCalledTimes(1);
    })

    it('should filter out elements', () => {
      const start = jest.fn();
      type Obj = {
        name: string,
        filter: boolean,
        filter2: boolean,
      }
      const tester = forEach().do(start, {
        keyExtractor: (item: Obj) => item.name
      })
        .filter(s => s.filter)
        .filter(s => s.filter2)

      const obj1 = {
        name: "object 1",
        filter: false,
        filter2: true,
      }
      const obj2 = {
        name: "object 2",
        filter: true,
        filter2: true,
      }
      const obj3 = {
        name: "object 3",
        filter2: false,
        filter: false,
      }
      const obj4 = {
        name: "object 4",
        filter: false,
        filter2: true,
      }
      tester([
        obj1,
        obj2,
        obj3,
        obj4,
      ]);
      expect(start).toHaveBeenCalledTimes(1);
    })
  })


})
