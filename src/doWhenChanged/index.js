import createNext from './../_libs/createNext';
import createConstruct from '../_libs/createConstruct'

export default function doWhenChanged(changedFunc) {
  return createConstruct((selector, constructMock, destructMock) => {

    let oldState = undefined
    let destruct

    return (state, ...args) => {
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
  })
}
