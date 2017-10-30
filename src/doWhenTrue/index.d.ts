
import {ChainAPI} from '../_libs/createChainAPI'

type DestructFunction = () => void
type ConstructFunction = (next: ChainAPI, ...args: any[]) => void | DestructFunction

export type DoWhen<I> = {
  (state: I, ...rest: any[]): void,
  map: <NI = any>(map: (s: NI) => I) => DoWhen<NI>,
  mock: (construct: ConstructFunction, destruct?: DestructFunction) => DoWhen<I>
}

export default function doWhenTrue (func: ConstructFunction): DoWhen<boolean>
