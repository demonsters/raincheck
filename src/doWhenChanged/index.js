
export default (selector, func) => {
  let oldState
  let destruct
  return (state, ...args) => {
    let val = selector(state)
    if (val !== oldState) {
      if (destruct) destruct()
      destruct = func(val, oldState, d => destruct = d, ...args)
      oldState = val
    }
  }
}
