import createNext from './../_libs/createNext';


function shallowDiffers (a, b) {
  if (a === b) return false
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}


const doWhen = (selector, call, destruct) => (checkFunc) => {
  let destructFuncs = {}
  let destructKeys

  const callFunc = () => (func, args, key) => {

    const index = destructKeys.indexOf(key)
    if (index > -1) destructKeys.splice(index, 1)

    if (destructFuncs[key] === undefined) {
      if (call) {
        call(func, args, key)
      } else {
        destructFuncs[key] = createNext(next => func(...args, next))
      }
      if (destruct) {
        destructFuncs[key] = () => destruct(key)
      }
      if (!destructFuncs[key]) {
        destructFuncs[key] = null
      }
    }
  }

  let oldState = {}

  const construct = (state) => {
    const newState = selector(state)
    if (shallowDiffers(oldState, newState)) {
      destructKeys = Object.keys(destructFuncs)
      checkFunc(newState, callFunc())

      destructKeys.forEach(key => {
        if (destructFuncs[key]) {
          destructFuncs[key]()
        }
      })

      oldState = newState
    }
  }
  construct.with = (selector) => doWhen(selector, call, destruct)(checkFunc)
  construct.mock = (call, destruct) => doWhen(selector, call, destruct)(checkFunc)
  return construct

}

export default doWhen(s => s)

