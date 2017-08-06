import createNext from './../_libs/createNext';

export default (selector, func) => {
  let oldState
  let destruct
  return (state, ...args) => {
    let val = selector(state)
    if (val !== oldState) {
      if (destruct) destruct()
      destruct = createNext(next => func(val, oldState, next, ...args))
      oldState = val
    }
  }
}
