import createNext from '../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct'
import doWhen from '../doWhen'

const forEachEntry = (selector, options) => {

  if (typeof selector !== "function") {
    options = selector
    selector = s => s
  }

  const create = (constructFunc, changed, deps) => {

    let cachedObjects
    let oldState = []

    const c = doWhen((state, call, filterFunc, ...args) => {
      if (state) {
        const entries = selector(state)

        if (entries) {

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
        
          const keys = Object.keys(entries)
          //.forEach((key, i) => {
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i]
            const object = entries[key]
            if (filterFunc(object) && !isOneFalsy) {
              call(constructFunc, newState ? [object, ...newState] : [object], key, ...args)
              
              if (changed && cachedObjects && cachedObjects[key] !== object) {
                changed(object, cachedObjects[key], key, ...args)
              }
            }
          }
        }

        // Cache current objects
        cachedObjects = entries
      }


    })
    
    return c
  }


  if (options) {
    if (typeof options === "function") {
      return create(options)
    }
    if (options.do) {
      return create(options.do, options.changed, options.when)
    }
  }

  return {
    do: (constructFunc, changed) => create(constructFunc, changed || (options ? options.changed : undefined), )
  }

}

export default forEachEntry