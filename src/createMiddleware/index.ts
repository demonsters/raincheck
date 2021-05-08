import { Middleware } from "redux";

 const createMiddleware = (...actors: Array<(state: any) => void>): Middleware => {
  return store => next => action => {
    const ret = next(action)
    actors.forEach(actor => actor(store.getState()))
    return ret
  }
}
export default createMiddleware