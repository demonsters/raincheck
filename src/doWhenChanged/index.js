import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct'

export default function doWhenChanged(changedFunc) {

  // if (typeof changedFunc === 'object') {
  //   const obj = changedFunc
  //   changedFunc = (...args) => {
  //     obj.begin.apply(obj, args)
  //     return () => obj.end.apply(obj)
  //   }
  // }

  return createConstruct((selector, constructMock, destructMock) => {

    let oldState = undefined
    let destruct

    return (state, ...args) => {
      let newState = selector(state)
      if (newState !== oldState) {
        if (destruct) destruct()
        if (newState !== undefined) {
          const tmp = oldState
          oldState = newState
          if (constructMock) {
            constructMock(changedFunc, newState, tmp) // need key?
          } else {
            destruct = createNext(next => changedFunc(newState, tmp, next, ...args))
          }
        }
      }
    }
  })
}
