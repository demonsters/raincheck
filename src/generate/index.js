import createNext from './../_libs/createNext';


function shallowDiffers (a, b) {
  // if (a === b) return true
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}


export default (selector, checkFunc) => {
  let destructFuncs = {}
  let destructKeys

  const callFunc = (callMock, destructMock) => (func, args, key) => {

    const index = destructKeys.indexOf(key)
    if (index > -1) destructKeys.splice(index, 1)

    if (destructFuncs[key] === undefined) {
      if (callMock) {
        callMock(func, args, key)
      } else {
        destructFuncs[key] = createNext(next => func(...args, next))
      }
      if (destructMock) {
        destructFuncs[key] = () => destructMock(key)
      }
      if (!destructFuncs[key]) {
        destructFuncs[key] = null
      }
    }
  }

  let oldState = {}

  return (state, callMock, destructMock) => {

    const newState = selector(state)
    if (shallowDiffers(oldState, newState)) {

      destructKeys = Object.keys(destructFuncs)
      checkFunc(newState, callFunc(callMock, destructMock))

      destructKeys.forEach(key => {
        if (destructFuncs[key]) {
          destructFuncs[key]()
        }
      })

      oldState = newState
    }

  }

}


export const withMockFunctions = (generator, callMock, destructMock) => {
  return (state) => generator(state, callMock, destructMock)
}
