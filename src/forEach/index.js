import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct';
import doWhen from '../doWhen'

const emptyObject = {}

export default function forEach(defaultValue, options) {

  const create = (constructFunc, defaultValue, changed, keyExtractor = s => s) => {

    let cachedObjects
    let newObjects

    const changedFunc = changed ? (key, object, i) => {
      if (i === 0) newObjects = {}
      newObjects[key] = object
      if (cachedObjects && cachedObjects[key] !== object) {
        changed(object, cachedObjects[key], key)
      }
    } : () => {}

    let selector
    if (typeof defaultValue === "function") {
      selector = defaultValue
      defaultValue = undefined
    } else {
      selector = s => s
    }

    const c = doWhen((state, call) => {
      if (state) {
        for (let i = 0; i < state.length; i++) {
          const object = state[i]
          const key = keyExtractor(object, i)
          call(constructFunc, object, key)
          changedFunc(key, object, i)
        }
        cachedObjects = newObjects
      } else {
        cachedObjects = emptyObject
      }
    }).map(selector)
    if (defaultValue !== undefined) {
      c(defaultValue)
    }
    return c
  }

  // if (typeof defaultValue === "function") {
  //   return forEach(defaultValue, undefined, options && options.changed, options && options.keyExtractor)
  // }

  if (options) {
    if (typeof options === "function") {
      return create(options, defaultValue)
    }
    if (options.do) {
      return create(options.do, defaultValue, options.changed, options.keyExtractor)
    }
  }

  return {
    do: (constructFunc, options) => {
      if (!options) {
        return create(constructFunc, defaultValue)
      }
      return create(constructFunc, defaultValue, options.changed, options.keyExtractor)
    }
  }

}

