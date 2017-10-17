import createNext from '../_libs/createNext';
import createConstruct from '../_libs/createConstruct'


export default function doForAll(constructFunc, changedFunc) {

  return createConstruct((selector, constructMock, destructMock) => {

    // Objects getting mutated!!
    let cachedObjects = {}
    let destructFuncs = {}

    return (state, ...args) => {

      // Get the objects
      const objects = selector(state)

      // Compare the object with the cached version
      if (objects === cachedObjects) {
        return
      }

      // If objects if falsy cancel all
      if (!objects) {
        Object.keys(destructFuncs).forEach(key => {
          if (destructFuncs[key]) {
            destructFuncs[key](cachedObjects[key])
          }
        })
        destructFuncs = {}
        cachedObjects = {}
        return
      }

      // Clone cached objects for destruction (mutated!!)
      let destructObjects = {...cachedObjects}

      // Check if object has added or changed
      Object.keys(objects).forEach(key => {
        const object = objects[key]

        // Check if object is new
        if (!cachedObjects.hasOwnProperty(key)) {
          if (constructMock) {
            constructMock(constructFunc, object) // need key?
          } else {
            destructFuncs[key] = createNext(next => constructFunc(object, next, ...args))
          }

        // Check if object has changed
        } else if (cachedObjects[key] !== object && changedFunc) {
          changedFunc(object, cachedObjects[key], ...args)
        }

        // Remove so it will not be destructed below
        delete destructObjects[key]
      })

      // Destruct objects
      Object.keys(destructObjects).forEach(key => {
        if (destructFuncs[key]) {

          // Call destruct function
          destructFuncs[key](destructObjects[key])

          // Remove destruct function
          delete destructFuncs[key]
        }
      })

      // Cache current objects
      cachedObjects = objects
    }
  })
}
