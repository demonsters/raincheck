import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct'

import doWhen from '../doWhen'

const when = (defaultValue, options) => {

  const create = (constructFunc, defaultValue) => {
  
    const c = createConstruct((selector, constructMock, destructMock) => {
  
      let oldState = undefined
      let destruct
  
      return (state, ...args) => {
        let newState = selector(state)
        if (newState !== oldState) {
          if (destruct) destruct()
          if (newState !== undefined && newState !== null && newState !== false) {
            const tmp = oldState
            oldState = newState
            if (constructMock) {
              constructMock(constructFunc, newState) // need key?
            } else {
              destruct = createNext(next => constructFunc(newState, next, ...args))
            }
          }
        }
      }
    })
    
    if (defaultValue !== undefined) {
      c(defaultValue)
    }
    return c
  }

  if (typeof defaultValue === "function") {
    return create(defaultValue, undefined)
  }

  if (options) {
    if (typeof options === "function") {
      return create(options, defaultValue)
    }
    if (options.do) {
      return create(options.do, defaultValue)
    }
  }
}
export default when
