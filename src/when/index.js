import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct'
import createSetup from '../_libs/createSetup';

// TODO: constructMock, destructMock

const emptyArray = []

const when = createSetup((selector, constructFunc, changedFunc = () => {}, keyExtractor = s => s, deps = null) => {
  
  const c = createConstruct((selector, constructMock, destructMock) => {

    if (deps) {

      let oldState = emptyArray
      let destruct
      let selectors = [selector, ...deps]
    
      return (state, ...args) => {
        let isChanged = false
        let isOneFalsy = false
        let newState = selectors.map((s, i) => {
          let newState = s(state)
          if (oldState.length < i || newState !== oldState[i]) {
            isChanged = true
          }
          isOneFalsy = isOneFalsy || (newState === undefined || newState === null || newState === false)
          return newState
        })
        const newKey = newState
        const oldKey = oldState
        if (isChanged) {
          if (destruct) destruct(...args)
          if (!isOneFalsy) {
            const tmp = oldState
            oldState = newState
            destruct = createNext(next => constructFunc(...newState, next, ...args))
          } else {
            // oldState = emptyArray
          }
        }
      }
    }

    let oldState = undefined
    let destruct

    return (state, ...args) => {
      let newState = selector(state)
      const newKey = newState && keyExtractor(newState)
      const oldKey = oldState && keyExtractor(oldState)
      if (newKey !== oldKey) {
        if (destruct) destruct(...args)
        if (newState !== undefined && newState !== null && newState !== false) {
          const tmp = oldState
          oldState = newState
          // if (constructMock) {
          //   constructMock(constructFunc, newState) // need key?
          // } else {
            destruct = createNext(next => constructFunc(newState, next, ...args))
          // }
        } else {
          oldState = false
        }
      } else if (newState !== oldState) {
        changedFunc(newState, oldState, newKey)
      }
    }
  }).map(selector)

  return c

})

export default when
