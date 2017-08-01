
export default (...actors) => {
  return store => next => action => {
    const ret = next(action)
    actors.forEach(actor => actor(store.getState(), store, action))
    return ret
  }
}
