import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct'


import doWhen from '../doWhen'


/**
 * @deprecated use 'when' instead
 */
const doWhenTrue = (defaultValue, options) => {

  console.warn("doWhenTrue is deprecated use 'when' instead")

  const create = (constructFunc, defaultValue) => {
  
    const c = createConstruct((selector, constructMock, destructMock) => {
  
      let oldState = undefined
      let destruct
  
      return (state, ...args) => {
        let newState = selector(state)
        if (newState !== oldState) {
          if (destruct) destruct()
          if (newState) {
            const tmp = oldState
            oldState = newState
            if (constructMock) {
              constructMock(constructFunc) // need key?
            } else {
              destruct = createNext(next => constructFunc(next, ...args))
            }
          } else {
            oldState = false
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
export default doWhenTrue
