
import doForAllKeys from '.'

describe('doForAllKeys()', () => {

  const start = jest.fn();
  const end = jest.fn();

  const TestActor = doForAllKeys(s => s, (...args) => {
    start(...args)
    return () => end(...args)
  })


  it('should work with arrays', () => {

    start.mockClear()
    end.mockClear()

    const obj1 = "object 1"
    const obj2 = "object 2"

    // Start obj1
    TestActor([obj1])
    TestActor([obj1])
    expect(start).toBeCalledWith(obj1)

    // Start obj2
    TestActor([obj1, obj2])
    TestActor([obj1, obj2])
    expect(start).toBeCalledWith(obj2)

    // End obj1
    TestActor([obj2])
    TestActor([obj2])
    expect(end).toBeCalledWith(obj1)

    // End obj2
    TestActor([])
    expect(end).toBeCalledWith(obj2)

    expect(start).toHaveBeenCalledTimes(2)
    expect(end).toHaveBeenCalledTimes(2)

  })

})
