import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct'

function shallowDiffers (a, b) {
  if (a === b) return false
  if (!a || !b) return true
  if (typeof a !== 'object' || typeof b !== 'object') return true
  for (let i in a) if (!(i in b)) return true
  for (let i in b) if (a[i] !== b[i]) return true
  return false
}


export default function doWhen(checkFunc) {

  return createConstruct((selector, constructMock, destructMock, filterFunc) => {

    let destructFuncs = {}
    let destructKeys

    const callFunc = (func, props, key) => {

      if (key === undefined) {
        if (typeof props === 'string') {
          key = props
        } else {
          key = "default"
        }
      }

      const index = destructKeys.indexOf(key)
      if (index > -1) destructKeys.splice(index, 1)

      if (destructFuncs[key] === undefined) {
        if (constructMock) {
          constructMock(func, props, key)
        } else {
          destructFuncs[key] = createNext(next => func(props, next))
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
        
        oldState = newState

        checkFunc(newState, callFunc, filterFunc)

        // destructKeys.forEach(key => {
        for (let i = 0; i < destructKeys.length; i++) {
          const key = destructKeys[i]
          if (destructFuncs[key]) {
            destructFuncs[key]()
            destructFuncs[key] = undefined
          }
        }

      }
    }
  })
}

