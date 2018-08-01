
const createNext = (parentFunc) => {

  let doNext = doDestruct => (...creators) => {

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
      destructs.forEach(destruct => {
        destruct && typeof destruct === 'function' && destruct(...args)
      })
      destructs.length = 0
    }

    parentFunc(destruct, doDestruct)

    return destruct
  }

  let next = doNext(true)
  next.branch = doNext(false)
  next.fork = doNext(false)
  next.complete = next
  next.resolve = next
  next.chain = next
  next.next = next

  return next
}

export default createNext(() => {})
