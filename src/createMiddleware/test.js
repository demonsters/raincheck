
import { createStore, applyMiddleware } from 'redux';

import createMiddleware from '.'
import doWhenTrue from '../doWhenTrue'


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


  it('should work when wired up in redux', () => {

    const start = jest.fn();
    const end = jest.fn();

    const tester = doWhenTrue(() => {
      start()
      return end
    }).with(s => s.active)

    const reducer = (state = {active: false}, action) => {
      switch (action.type) {
        case "ACTIVATE":
          return {
            active: true
          }
        case "DEACTIVATE":
          return {
            active: false
          }
      }
      return state
    }

    const store = createStore(reducer, applyMiddleware(createMiddleware(tester)))
    expect(start).not.toBeCalled()
    store.dispatch({type: "ACTIVATE"})
    expect(start).toBeCalled()
    store.dispatch({type: "DEACTIVATE"})
    expect(end).toBeCalled()

  })

})
