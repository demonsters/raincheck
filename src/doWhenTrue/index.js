import createNext from './../_libs/createNext';

export default (func) => {
  let oldState
  let destruct

  const construct = (state, ...args) => {
    if (state !== oldState) {
      oldState = state
      if (state) {
        destruct = createNext(next => func(next, ...args))
      } else if (destruct) {
        destruct()
      }
    }
  }

  construct.with = (selector) => (state, ...args) => (
     construct(selector(state), ...args)
  )
  return construct
}
