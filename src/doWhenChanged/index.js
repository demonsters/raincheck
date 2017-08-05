
export default (selector, func) => {
  let oldState
  return (state, ...args) => {
    let val = selector(state)
    if (val !== oldState) {
      func(val, oldState, ...args)
      oldState = val
    }
  }
}
