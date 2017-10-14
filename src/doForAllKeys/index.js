import createNext from './../_libs/createNext';


const doForAllKeys = (selector, constructMock, destructMock) => (constructFunc) => {

  let cachedObjects = []
  let destructFuncs = {}

  // Create the next function
  // const createNext = key => destructFunc => {
  //   destructFuncs[key] = destructFunc
  // }

  const construct = (state, ...args) => {

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

  construct.mock = (constructMock, destructMock) => doForAllKeys(selector, constructMock, destructMock)(constructFunc)
  construct.with = (selector) => doForAllKeys(selector)(constructFunc)
  construct.map = construct.with
  return construct
}

export default doForAllKeys(s => s)
