import createNext from './../_libs/createNext';
import createConstruct from '../_libs/createConstruct'

function shallowDiffers (a, b) {
  if (a === b) return false
  if (typeof a !== 'object' || typeof b !== 'object') return true
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}


export default function doWhen(checkFunc) {

  return createConstruct((selector, constructMock, destructMock) => {

    let destructFuncs = {}
    let destructKeys

    const callFunc = (func, args, key) => {

      const index = destructKeys.indexOf(key)
      if (index > -1) destructKeys.splice(index, 1)

      if (destructFuncs[key] === undefined) {
        if (constructMock) {
          constructMock(func, args, key)
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

    return (state, args) => {
      const newState = selector(state)
      if (shallowDiffers(oldState, newState)) {
        destructKeys = Object.keys(destructFuncs)
        checkFunc(newState, callFunc)

        destructKeys.forEach(key => {
          if (destructFuncs[key]) {
            destructFuncs[key]()
          }
        })

        oldState = newState
      }
    }
  })
}

