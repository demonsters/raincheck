

const createNext = () => {

  let destructs = []
  
  const createNextAPI = (parentFunc) => {

    const doNext = (shouldDestruct) => (...constructors) => {

      parentFunc(shouldDestruct)

      // Add new destructs
      const destructors = constructors.forEach(constructor => {
        if (!constructor) return
        const destruct = constructor(createNextAPI((didDestruct) => {
          if (didDestruct) {
            destructs = destructs.filter(d => d !== destruct)
          }
        }))
        if (destruct && typeof destruct === "function") {
          destructs.push(destruct)
        }
      })

      // Destructs
      return (...args) => {
        destructs.forEach((destruct) => destruct(...args))
        destructs.length = 0
      }
    }

    let nextAPI = doNext(true)
    nextAPI.branch = doNext(false)
    nextAPI.fork = doNext(false)
    nextAPI.complete = nextAPI
    nextAPI.finish = nextAPI
    nextAPI.resolve = nextAPI
    nextAPI.chain = nextAPI
    nextAPI.next = nextAPI
    return nextAPI
  }

  return createNextAPI(() => {})
}

export default (...args) => createNext()(...args)
