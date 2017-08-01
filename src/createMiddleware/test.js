
import createMiddleware from '.'

describe('createMiddleware()', () => {

  it('call listener with state, store and action', () => {

    const listener = jest.fn();
    const middleware = createMiddleware(listener)

    const state = {"key": "value"}
    const store = {
      getState: () => state
    }
    const next = jest.fn();
    const action = {
      type: "ACTION"
    }

    middleware(store)(next)(action)

    expect(listener).toBeCalledWith(state, store, action)
    expect(next).toBeCalledWith(action)
  })

})
