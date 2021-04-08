
import {ChainAPI} from '../createChainAPI'

type ConstructFunction<S> = (value: S, next: ChainAPI, ...args: any[]) => void | DestructFunction
type DestructFunction = () => void

export type DoWhen<O, I> = {
  (state?: I, ...rest: any[]): void,
  map: <NI = any>(map: (s: NI) => I) => DoWhen<O, NI>,
  mock: (construct: ConstructFunction<O>, destruct?: DestructFunction) => DoWhen<O, I>
}
