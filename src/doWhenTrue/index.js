import createNext from './../_libs/createNext';

const doWhenTrue = (selector, constructMock) => (constructFunc) => {
  let oldState
  let destruct

  const construct = (state, ...args) => {
    const newState = selector(state)
    if (newState !== oldState) {
      oldState = newState
      if (newState) {
        if (constructMock) {
          constructMock(constructFunc)
        } else {
          destruct = createNext(next => constructFunc(next, ...args))
        }
      } else if (destruct) {
        destruct()
      }
    }
  }
  construct.mock = (constructMock) => doWhenTrue(selector, constructMock)(constructFunc)
  construct.with = (selector) => doWhenTrue(selector, constructMock)(constructFunc)
  return construct
}

export default doWhenTrue(s => s)
