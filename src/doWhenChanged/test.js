
import doWhenChanged from '.'

describe('doWhenChanged()', () => {

  const setup = () => {
    const changed = jest.fn();
    const tester = doWhenChanged(s => s, changed)

    return {
      changed,
      tester
    }
  }

  it('should work with numbers', () => {

    const {changed,tester} = setup()

    tester(1)
    expect(changed).toBeCalledWith(1, undefined)

    tester(2)
    expect(changed).toBeCalledWith(2, 1)

    expect(changed).toHaveBeenCalledTimes(2)

  })

  it('should work with strings', () => {

    const {changed,tester} = setup()

    tester("string1")
    expect(changed).toBeCalledWith("string1", undefined)

    tester("string2")
    expect(changed).toBeCalledWith("string2", "string1")

    expect(changed).toHaveBeenCalledTimes(2)

  })

})

