import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct';
import doWhen from '../doWhen'


export default function doForAllKeys(constructFunc) {

  return doWhen((state, call) => {
    state.forEach(key => call(constructFunc, key))
  })

  return createConstruct((selector, constructMock, destructMock) => {

    let cachedObjects = []
    let destructFuncs = {}

    return (state, ...args) => {

      const objects = selector(state)

      if (objects === cachedObjects) {
        return
      }

      let destructObjects = cachedObjects.concat()

      objects.forEach(key => {
        if (cachedObjects.indexOf(key) === -1) {
          if (constructMock) {
            constructMock(constructFunc, key)
          } else {
            destructFuncs[key] = createNext(next => constructFunc(key, next, ...args))
          }
        }
        // Remove so it will not be destructed below
        const index = destructObjects.indexOf(key)
        if (index > -1) {
          destructObjects.splice(index, 1);
        }
      })

      destructObjects.forEach(key => {
        if (destructFuncs[key]) {
          destructFuncs[key](destructObjects[key])
        }
      })

      cachedObjects = objects

    }
  })
}

