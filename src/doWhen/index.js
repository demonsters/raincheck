import createNext from './../_libs/createNext';

export default (selector, func) => {
  let oldState
  let destruct
  return (state, ...args) => {
    let val = selector(state)
    if (val !== oldState) {
      oldState = val
      if (val) {
        destruct = createNext(next => func(next, ...args))
      } else if (destruct) {
        destruct()
      }
    }
  }
}
