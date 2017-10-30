
type DestructFunction = () => void

export type ChainAPI = {
  (destructFunction: (next: ChainAPI) => void | DestructFunction): void,
  next: (destructFunction: (next: ChainAPI) => void | DestructFunction) => void,
  branch: (destructFunction: (next: ChainAPI) => void | DestructFunction) => void,
}
