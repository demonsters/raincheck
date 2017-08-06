
const createNext = (...creators) => {

  if (creators.length === 0) {
    return
  }

  let doDestruct = true
  if (creators[0] === false) {
    doDestruct = false
  }

  // call all creators, and add the destruct returns into an array
  let destructs = creators
    .map(creator => {

      if (!creator) {
        return null
      }

      let destruct

      const next = (...args) => {
        const d = createNext(...args)

        // Here we prevent the old destruct if never be called
        destructs = destructs.filter(d => d !== destruct)

        // Add the new destruct function
        destructs.push(d)
        return d
      }

      destruct = creator(next)
      if (!destruct) {
        return null
      }

      // Wrap the destruct so the destruct is never called twice??
      // destruct2 = () => {
      //   destructs = destructs.filter(d => d !== destruct2)  // TODO: add unit test for this
      //   return destruct1()
      // }
      return destruct
    })

  // Create a new destruct which calls all destructs
  const destruct = (...args) => {
    destructs.forEach(destruct => destruct && destruct(...args))
    destructs.length = 0
  }

  return destruct
}

export default createNext
