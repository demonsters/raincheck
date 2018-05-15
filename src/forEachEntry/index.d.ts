
import {DoWhen, ConstructFunction} from '../_libs/createConstruct'

type ChangedFunction<S> = (newValue: S, oldValue: void | S, ...args: any[]) => void

export default function forEachKey<S> (startFunc: ConstructFunction<S>, changedFunc?: ChangedFunction<S>): DoWhen<S, {[key: string]: S}>
export default function forEachKey<S, P> (defaultValue:S, startFunc: ConstructFunction<S, P>, changedFunc?: ChangedFunction<S, P>): DoWhen<S, {[key: string]: S}, P>

type ChainFunctions<S> = {
  do: <P>(startFunc: ConstructFunction<S, P>, changedFunc?: ChangedFunction<S, P>) => DoWhen<S, {[key: string]: S}, P>
}

export default function forEachKey<S> (defaultValue:S): ChainFunctions<S>

