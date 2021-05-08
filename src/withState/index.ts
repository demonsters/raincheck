
const withState = <S> (raincheck: (state: S) => void) => {

  let state: S = undefined
   
  return {
    setState: (newState: Partial<S>) => {
      if (state) {
        state = {
          ...state,
          ...newState
        }
      } else {
        state = newState as S
      }
      raincheck(state)
    },
    getState: () => state
  }
}

export default withState