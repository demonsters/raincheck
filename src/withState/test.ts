
import raincheck from '../doWhen'
import withState from '.'

test('withState', () => {

  const render = withState<{ isConnected: boolean, users: Array<number> }>(
    raincheck((call, state) => {
      if (!state.isConnected) {
        call(() => {
          render.setState({
            isConnected: true
          })
        }, "connected")
      } else {
        expect(state).toEqual({
          isConnected: true,
          users: [1]
        })
      }
    })
  )
  
  render.setState({
    isConnected: false,
    users: [1]
  })

  expect(render.getState()).toEqual({
    isConnected: true,
    users: [1]
  })
})
