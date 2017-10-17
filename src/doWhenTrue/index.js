import createNext from './../_libs/createNext';
import createConstruct from '../_libs/createConstruct';

export default function doWhenTrue(constructFunc) {
  return createConstruct((selector, constructMock, destructMock) => {
    let oldState
    let destruct
    return (state, ...args) => {
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
  })
}
