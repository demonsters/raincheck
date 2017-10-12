import createNext from './../_libs/createNext';

const doWhenChanged = (selector, constructMock) => (changedFunc) => {
  let oldState = undefined
  let destruct
  const construct = (state, ...args) => {
    let newState = selector(state)
    if (newState !== oldState) {
      if (destruct) destruct()
      if (newState !== undefined) {
        if (constructMock) {
          constructMock(changedFunc, newState, oldState) // need key?
        } else {
          destruct = createNext(next => changedFunc(newState, oldState, next, ...args))
        }
      }
      oldState = newState
    }
  }
  construct.mock = (constructMock) => doWhenChanged(selector, constructMock)(changedFunc)
  construct.with = (selector) => doWhenChanged(selector, constructMock)(changedFunc)
  return construct
}
export default doWhenChanged(s => s)
