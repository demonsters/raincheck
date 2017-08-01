
export default (selector, func) => {
  let oldState
  let destruct
  return (state, ...args) => {
    let val = selector(state)
    if (val !== oldState) {
      oldState = val
      if (val) {
        destruct = func(d => destruct = d, ...args)
      } else if (destruct) {
        destruct()
      }
    }
  }
}
