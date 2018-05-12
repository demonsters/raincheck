import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct';
import doWhen from '../doWhen'

export default function forEach(defaultValue, options) {

  const create = (constructFunc, defaultValue, keyExtractor = s => s, changed) => {

    let cachedObjects

    const c = doWhen((state, call) => {
      let newObjects = !!changed && {}
      if (state) {
        for (let i = 0; i < state.length; i++) {
          const object = state[i]
          const key = keyExtractor(object, i)
          call(constructFunc, object, key)
          if (changed) {
            newObjects[key] = object

            if (cachedObjects && cachedObjects[key] !== object) {
              changed(object, cachedObjects[key], key)
            }
          }
        }
      }
      
      cachedObjects = newObjects
      
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

  // return {
  //   do: (constructFunc) => create()
  // }

}

