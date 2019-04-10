
const checkDeps = (selectors) => {
  if (!selectors) {
    return null
  }
  let oldState = []
  return (state) => {
    let isChanged = false
    let isOneFalsy = false
    return selectors.map((s, i) => {
      let newState = !isOneFalsy && s(state)
      if (oldState.length < i || newState !== oldState[i]) {
        isChanged = true
      }
      isOneFalsy = isOneFalsy || (newState === undefined || newState === null || newState === false)
      return newState
    })
    if (isOneFalsy) {
      return null
    }
    return { newState, isOneFalsy, isChanged }
  }
}

export default checkDeps