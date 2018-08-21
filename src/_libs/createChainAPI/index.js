

const createNext = () => {

  let destructs = []
  let branch = []
  
  const createNextAPI = (parentFunc) => {

    const doNext = (shouldDestruct) => (...constructors) => {

      parentFunc(shouldDestruct)

      // Add new destructs
      const destructors = constructors.forEach(constructor => {
        if (!constructor) return
        const destruct = constructor(createNextAPI((didDestruct) => {
          if (didDestruct) {
            if (shouldDestruct) {
              destructs = destructs.filter(d => d !== destruct)
            } else {
              branch = branch.filter(d => d !== destruct)
            }
          }
        }))
        if (!destruct) return
        if (shouldDestruct) {
          destructs.push(destruct)
        } else {
          branch.push(destruct)
        }
      })

      // Destructs
      return (...args) => {
        branch.forEach((destruct) => destruct(...args))
        branch.length = 0
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
