import createNext from './../_libs/createNext';

export default (selector, func) => {
  let oldState = undefined
  let destruct
  return (state, ...args) => {
    let val = selector(state)
    if (val !== oldState) {
      if (destruct) destruct()
      if (val !== undefined) {
        destruct = createNext(next => func(val, oldState, next, ...args))
      }
      oldState = val
    }
  }
}
