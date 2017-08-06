
const createNext = (parentFunc) => {

  let doNext = (...creators) => {

    // call all creators, and add the destruct returns into an array
    let destructs = creators
      .map(creator => {

        if (!creator) {
          return null
        }

        let destruct

        const next = createNext((d, doDestruct) => {

          if (doDestruct) {
            destructs = destructs.filter(d => d !== destruct)
          }

          // Add the new destruct function
          destructs.push(d)

        })

        destruct = creator(next)
        if (!destruct) {
          return null
        }

        return destruct
      })

    // Create a new destruct which calls all destructs
    const destruct = (...args) => {
      destructs.forEach(destruct => destruct && destruct(...args))
      destructs.length = 0
    }

    parentFunc(destruct, creators[0] !== false)

    return destruct
  }

  let next = (...args) => doNext(...args)
  next.branch = (...args) => doNext(false, ...args)
  next.complete = doNext
  next.resolve = doNext
  next.chain = doNext

  return next
}

export default createNext(() => {})
