

export default (selector, startFunc) => {

  let cachedObjects = []
  let destructFuncs = {}

  // Create the next function
  const createNext = key => destructFunc => {
    destructFuncs[key] = destructFunc
  }

  return (state, ...args) => {

    const objects = selector(state)

    if (objects === cachedObjects) {
      return
    }

    let destructObjects = cachedObjects.concat()

    objects.forEach(key => {
      if (cachedObjects.indexOf(key) === -1) {
        destructFuncs[key] = startFunc(key, createNext(key), ...args)
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

}


