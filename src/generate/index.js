import createNext from './../_libs/createNext';


function shallowDiffers (a, b) {
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}


export default (selector, checkFunc) => {
  let destructFuncs = {}
  let destructKeys

  const callFunc = (func, args, key) => {

    const index = destructKeys.indexOf(key)
    if (index > -1) destructKeys.splice(index, 1)

    if (destructFuncs[key] === undefined) {
      destructFuncs[key] = createNext(next => func(...args, next))
      if (!destructFuncs[key]) {
        destructFuncs[key] = null
      }
    }
  }

  let oldState = {}

  return (state, call = callFunc) => {

    const newState = selector(state)
    if (shallowDiffers(oldState, newState)) {

      destructKeys = Object.keys(destructFuncs)
      checkFunc(newState, call)

      destructKeys.forEach(key => {
        if (destructFuncs[key]) {
          destructFuncs[key]()
        }
      })

      oldState = newState
    }

  }

}
