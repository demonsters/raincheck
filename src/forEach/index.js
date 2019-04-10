import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct';
import createSetup from '../_libs/createSetup';
import doWhen from '../doWhen'
import checkDeps from '../_libs/checkDeps';

const emptyObject = {}

export default createSetup((selector, constructFunc, changed, keyExtractor = s => s, deps = null) => {

  let cachedObjects
  let newObjects

  const changedFunc = changed ? (key, object, i, ...args) => {
    if (i === 0) newObjects = {}
    newObjects[key] = object
    if (cachedObjects && cachedObjects[key] !== undefined && cachedObjects[key] !== object) {
      changed(object, cachedObjects[key], key, ...args)
    }
  } : () => {}

  let oldState = []

  const c = doWhen((state, call, filterFunc, ...args) => {
    if (state) {
      const array = selector(state)

      if (array) {
        let isChanged = false
        let isOneFalsy = false
        let newState = deps && deps.map((s, i) => {
          let newState = !isOneFalsy && s(state)
          if (oldState.length < i || newState !== oldState[i]) {
            isChanged = true
          }
          isOneFalsy = isOneFalsy || (newState === undefined || newState === null || newState === false)
          return newState
        })

        for (let i = 0; i < array.length; i++) {
          const object = array[i]
          const key = keyExtractor(object, i)
          if (filterFunc(object, key) && !isOneFalsy) {
            call(constructFunc, newState ? [object, ...newState] : [object], key, ...args)
            changedFunc(key, object, i, ...args)
          }
        }
        cachedObjects = newObjects
        return
      }
    }
    cachedObjects = emptyObject
  })
  
  return c
})

