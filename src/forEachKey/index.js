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

    // Objects getting mutated!!
    let cachedObjects = {}


    const c = doWhen((state, call) => {
      if (state) {

        Object.keys(state).forEach((key, i) => {
          const object = state[key]
          call(constructFunc, object, key)
          
          if (cachedObjects[key] !== object && changed) {
            changed(object, cachedObjects[key], key)
          }
        })
      }

      // Cache current objects
      cachedObjects = state

    })
    // .map(o => {
    //   if (cachedObject === o) {
    //     return cachedValues
    //   }
    //   if (!o) return null
    //   cachedObject = o
    //   keys = Object.keys(o)
    //   cachedValues = Object.values(o)
    //   return cachedValues
    // })
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