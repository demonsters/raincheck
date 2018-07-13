import createNext from '../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct'
import doWhen from '../doWhen'

const forEachEntry = (defaultValue, options) => {

  const create = (constructFunc, defaultValue, changed) => {

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

    })
    if (defaultValue !== undefined) {
      c(defaultValue)
    }
    return c
  }

  if (typeof defaultValue === "function") {
    if (options && typeof options === "function") {
      return forEachEntry(undefined, {
        changed: options,
        do: defaultValue,
      })
    }
    return forEachEntry(undefined, {
      ...options,
      do: defaultValue,
    })
  }

  if (options) {
    if (typeof options === "function") {
      return create(options, defaultValue)
    }
    if (options.do) {
      return create(options.do, defaultValue, options.changed)
    }
  }

  return {
    do: (constructFunc, changed) => create(constructFunc, defaultValue, changed)
  }

}

export default forEachEntry