
const createNext = (parentFunc, shouldCheckDouble) => {
  let calledNext = false

  let doNext = (doDestruct) => (...creators) => {

    if (shouldCheckDouble && calledNext && doDestruct) {
      // Silently prevent next from being called twice
      // console.warn("cannot call destruct twice")
      return
    }
    calledNext = true

    // call all creators, and add the destruct returns into an array
    let destructs = creators
      .map(creator => {

        if (!creator) {
          return null
        }

        let destruct


        const next = createNext((d, doDestruct) => {
          
          // This is called when a `next` is called on a child 
          
          if (doDestruct) {
            destructs = destructs.filter(d => d !== destruct)
          }

          // Add the new destruct function
          destructs.push(d)

        }, true)

        destruct = creator(next)
        if (!destruct) {
          return null
        }

        return destruct
      })

    // Create a new destruct which calls all destructs
    const destructFunc = (...args) => {
      destructs.forEach(destruct => {
        destruct && typeof destruct === 'function' && destruct(...args)
      })
      destructs.length = 0
    }

    parentFunc(destructFunc, doDestruct)

    return destructFunc
  }

  let next = doNext(true)
  next.branch = doNext(false)
  next.fork = doNext(false)
  next.complete = next
  next.finish = next
  next.resolve = next
  next.chain = next
  next.next = next

  return next
}

export default createNext(() => {}, false)
