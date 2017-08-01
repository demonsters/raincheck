
export default (selector, func) => {
  let oldState
  return (store, action) => {
    let val = selector(store.getState())
    if (val !== oldState) {
      oldState = val
      func(store)
    }
  }
}
