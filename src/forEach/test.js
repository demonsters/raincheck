// @flow

import forEach from '.'
import type { ChainAPI } from '../index';

describe('forEach()', () => {

  it('should work when given constructor as option do', () => {
    const start = jest.fn();
    forEach({
      do: start
    })(['element'])
    expect(start).toHaveBeenCalledTimes(1)
  })

  it('should work when given constructor as function option', () => {
    const start = jest.fn();
    forEach((s: Array<string>) => s, () => start())(['element'])

    expect(start).toHaveBeenCalledTimes(1)
  })

  it('should work with do function chaining', () => {
    const start = jest.fn();
    forEach().do(start)(['element'])
    expect(start).toHaveBeenCalledTimes(1)
  })
  
  // it('should work with key extractor', () => {
  //   const start = jest.fn();
  //   const element1 = {name: 'element', id: 1}
  //   const element2 = {name: 'element', id: 2}
  //   const doIt = forEach([element1], {
  //     do: start,
  //     keyExtractor: s => s.id
  //   })
  //   doIt([element1, element2])
  //   expect(start).toBeCalledWith(element1, expect.anything())
  //   expect(start).toBeCalledWith(element2, expect.anything())
  // })
  
  it('should work with key extractor & do function', () => {
    const start = jest.fn();
    const element1 = {name: 'element', id: 1}
    const element2 = {name: 'element', id: 2}
    const doIt = forEach((e: Array<{name: string, id: number}>) => e, {
      keyExtractor: s => s.id,
      do: start
    })
    doIt([element1])
    doIt([element1, element2])
    expect(start).toBeCalledWith(element1, expect.anything())
    expect(start).toBeCalledWith(element2, expect.anything())
  })  
  
  it('should work only options', () => {
    const start = jest.fn();
    const element1 = {name: 'element', id: 1}
    const element2 = {name: 'element', id: 2}
    const doIt = forEach({
      do: start,
      keyExtractor: s => s.id
    })
    doIt([element1])
    doIt([element1, element2])
    expect(start).toBeCalledWith(element1, expect.anything())
    expect(start).toBeCalledWith(element2, expect.anything())
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
    const tester = forEach({
      do: (item: Array<typeof obj1>) => start(item),
      changed,
      keyExtractor: s => s.id
    })

    tester([obj1])

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
        filter1: boolean,
        filter2: boolean,
      }
      const tester = forEach().do(start, {
        keyExtractor: (item: Obj) => item.name
      })
        .filter(s => s.filter1)
        .filter(s => s.filter2)

      const obj1 = {
        name: "object 1",
        filter1: false,
        filter2: true,
      }
      const obj2 = {
        name: "object 2",
        filter1: true,
        filter2: true,
      }
      const obj3 = {
        name: "object 3",
        filter2: false,
        filter1: false,
      }
      const obj4 = {
        name: "object 4",
        filter1: false,
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

  it('should pass down rest arguments', () => {

    const start = jest.fn()
    const changed = jest.fn()
    const arg1 = {}
    const arg2 = {}
    let check = forEach({
      keyExtractor: item => item.id,
      do: start,
      changed
    })
    const obj1 = {id: 'one'}
    const obj2 = {id: 'one'}
    check([obj1], arg1, arg2)
    check([obj2], arg1, arg2)

    expect(start).toBeCalledWith(obj1, expect.anything(), arg1, arg2);
    expect(changed).toBeCalledWith(obj2, obj1, expect.anything(), arg1, arg2);

  })

})
