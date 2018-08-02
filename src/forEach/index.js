import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct';
import doWhen from '../doWhen'

const emptyObject = {}

export default function forEach(selector, options) {

  if (typeof selector !== "function") {
    options = selector
    selector = s => s
  }

  const create = (constructFunc, changed, keyExtractor = s => s) => {

    let cachedObjects
    let newObjects

    const changedFunc = changed ? (key, object, i, ...args) => {
      if (i === 0) newObjects = {}
      newObjects[key] = object
      if (cachedObjects && cachedObjects[key] !== undefined && cachedObjects[key] !== object) {
        changed(object, cachedObjects[key], key, ...args)
      }
    } : () => {}


    const c = doWhen((state, call, filterFunc, ...args) => {
      if (state) {
        for (let i = 0; i < state.length; i++) {
          const object = state[i]
          const key = keyExtractor(object, i)
          if (filterFunc(object, key)) {
            call(constructFunc, object, key, ...args)
            changedFunc(key, object, i, ...args)
          }
        }
        cachedObjects = newObjects
      } else {
        cachedObjects = emptyObject
      }
    }).map(selector)
    
    return c
  }

  // if (typeof defaultValue === "function") {
  //   return forEach(defaultValue, undefined, options && options.changed, options && options.keyExtractor)
  // }

  if (options) {
    if (typeof options === "function") {
      return create(options)
    }
    if (options.do) {
      return create(options.do, options.changed, options.keyExtractor)
    }
  }

  return {
    do: (constructFunc, o) => {
      o = {
        ...options,
        ...o,
      }
      return create(constructFunc, o.changed, o.keyExtractor)
    }
  }

}

