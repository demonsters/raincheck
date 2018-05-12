import createNext from '../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct'
import doWhen from '../doWhen'

const forEachKey = (defaultValue, options) => {

  let cachedValues
  let cachedObject
  let keys
  const keyExtractor = (s, i) => keys ? keys[i] : 0

  if (options) {
    if (typeof options === "function") {
      options = {
        keyExtractor,
        do: options
      }
    } else if (options.do) {
      options = {
        ...options,
        keyExtractor
      }
    }
  } else {
    options = {
      keyExtractor
    }
  }

  const create = (constructFunc, defaultValue, keyExtractor = s => s, changed) => {

    let cachedObjects

    const c = doWhen((state, call) => {
      if (state) {

        const keys = Object.keys(state)
        //.forEach((key, i) => {
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i]
          const object = state[key]
          call(constructFunc, object, key)
          
          if (changed && cachedObjects && cachedObjects[key] !== object) {
            changed(object, cachedObjects[key], key)
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
    return create(defaultValue, undefined, options && options.keyExtractor, options && options.changed)
  }

  if (options) {
    if (typeof options === "function") {
      return create(options, defaultValue)
    }
    if (options.do) {
      return create(options.do, defaultValue, options.keyExtractor, options.changed)
    }
  }
}

export default forEachKey