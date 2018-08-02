import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct'

import doWhen from '../doWhen'

const when = (selector, options) => {

  if (typeof selector !== "function") {
    options = selector
    selector = s => s
  }

  const create = (constructFunc) => {
      
    const c = createConstruct((selector, constructMock, destructMock) => {
  
      let oldState = undefined
      let destruct
  
      return (state, ...args) => {
        let newState = selector(state)
        if (newState !== oldState) {
          if (destruct) destruct(...args)
          if (newState !== undefined && newState !== null && newState !== false) {
            const tmp = oldState
            oldState = newState
            if (constructMock) {
              constructMock(constructFunc, newState) // need key?
            } else {
              destruct = createNext(next => constructFunc(newState, next, ...args))
            }
          } else {
            oldState = false
          }
        }
      }
    }).map(selector)
    
    return c
  }

  // if (typeof defaultValue === "function") {
  //   return create(defaultValue, undefined)
  // }

  if (options) {
    if (typeof options === "function") {
      return create(options)
    }
    if (options.do) {
      return create(options.do)
    }
  }

  return {
    do: (constructFunc) => create(constructFunc)
  }

}
export default when
