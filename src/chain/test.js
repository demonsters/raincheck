
import when from '.'

xdescribe('chain()', () => {

  it('should work the same as when', () => {
    const start = jest.fn();

    const tester = when(s => s.value).do(start)

    const obj1 = "object 1"
    tester({ value: obj1 });
    expect(start).toBeCalledWith(obj1, expect.anything());
  })

  it('should be able to chain when', () => {

    const start = jest.fn();

    const tester = when(props => props.a)
      .and(when(props => props.b))
      .do(start)

    tester({a: true, b: false})

    expect(start).not.toBeCalled()

    tester({a: false, b: true})

    expect(start).not.toBeCalled()

    tester({a: true, b: true})

    expect(start).toBeCalled()

  })

  
  it('should be able to chain forEach', () => {

    const start = jest.fn();

    const tester = when(props => props.a)
      .forEach(props => props.b)
      .do(start)


    tester({a: true, b: false})

    expect(start).not.toBeCalled()

    tester({a: false, b: ["1", "2"]})

    expect(start).not.toBeCalled()

    tester({a: true, b: ["1", "2"]})

    expect(start).toHaveBeenCalledTimes(2)

  })
  
  it('should be able to chain forEachEntry', () => {

    const start = jest.fn();

    const tester = when(props => props.a)
      .forEachEntry(props => props.b)
      .do(start)


    tester({a: true, b: false})

    expect(start).not.toBeCalled()

    tester({a: false, b: {"1": true, "2": true}})

    expect(start).not.toBeCalled()

    tester({a: true, b: {"1": true, "2": true}})

    expect(start).toHaveBeenCalledTimes(2)

  })



  it('should be able to chain more', () => {

    const start1 = jest.fn();
    const start2 = jest.fn();

    const tester = when(props => props.a)
      .when(props => props.b).do(start1)
      .when(props => props.c).do(start2)

    tester({a: true, b: false, c: false})
    expect(start1).not.toBeCalled()
    expect(start2).not.toBeCalled()

    tester({a: false, b: true, c: false})
    expect(start1).not.toBeCalled()
    expect(start2).not.toBeCalled()

    tester({a: true, b: true, c: false})
    expect(start1).toBeCalled()
    expect(start2).not.toBeCalled()

    tester({a: true, b: true, c: true})
    expect(start2).toBeCalled()

  })


})

