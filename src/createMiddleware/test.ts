import { createStore, applyMiddleware, MiddlewareAPI } from "redux";

import createMiddleware from ".";
import doWhen from "../doWhen";

describe("createMiddleware()", () => {
  it("call listener with state, store and action", () => {
    const listener = jest.fn();
    const middleware = createMiddleware(listener);

    const state = { key: "value" };
    // @ts-ignore Only mock whats needed
    const store: MiddlewareAPI<{ key: string }> = {
      getState: () => state,
    };
    const next = jest.fn();
    const action = {
      type: "ACTION",
    };

    middleware(store)(next)(action);

    expect(listener).toBeCalledWith(state);
    expect(next).toBeCalledWith(action);
  });

  type State = { active: boolean };

  it("should work when wired up in redux", () => {
    const start = jest.fn();
    const end = jest.fn();

    const tester = doWhen((call, props: State) => {
      if (props.active) {
        call(() => {
          start();
          return end;
        });
      }
    });

    const reducer = (state = { active: false }, action) => {
      switch (action.type) {
        case "ACTIVATE":
          return {
            active: true,
          };
        case "DEACTIVATE":
          return {
            active: false,
          };
      }
      return state;
    };

    const store = createStore<State>(
      reducer,
      applyMiddleware(createMiddleware(tester))
    );
    expect(start).not.toBeCalled();
    store.dispatch({ type: "ACTIVATE" });
    expect(start).toBeCalled();
    store.dispatch({ type: "DEACTIVATE" });
    expect(end).toBeCalled();
  });
});
