import createNext from '../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct'
import doWhen from '../doWhen'

const forEachEntry = (selector, options) => {

  if (typeof selector !== "function") {
    options = selector
    selector = s => s
  }

  const create = (constructFunc, changed) => {

    let cachedObjects

    const c = doWhen((state, call, filterFunc) => {
      if (state) {

        const keys = Object.keys(state)
        //.forEach((key, i) => {
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          const object = state[key]
          if (filterFunc(object)) {
            call(constructFunc, object, key)
            
            if (changed && cachedObjects && cachedObjects[key] !== object) {
              changed(object, cachedObjects[key], key)
            }
          }
        }
      }

      // Cache current objects
      cachedObjects = state

    }).map(selector)
    
    return c
  }


  if (options) {
    if (typeof options === "function") {
      return create(options)
    }
    if (options.do) {
      return create(options.do, options.changed)
    }
  }

  return {
    do: (constructFunc, changed) => create(constructFunc, changed || (options ? options.changed : undefined))
  }

}

export default forEachEntry