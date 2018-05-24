
import {DoWhen, ConstructFunction} from '../_libs/createConstruct'

type ChangedFunction<S, P> = (newValue: S, oldValue?: S, ...args: P) => void

type Options<S, P> = $Exact<{
  do: ConstructFunction<S, P>,
  changed?: ChangedFunction<S, P>
}>

// type CallableObject = {|
//   (...r: Array<any>): any
// |}

type Value<S> = { [key: string]: S } | null | false | void


type ChainFunctions<S, I> = {
  do: <P>(startFunc: ConstructFunction<S, P>, changedFunc?: ChangedFunction<S, P>) => DoWhen<S, I, P>
}


// declare export default function forEachEntry<S, P> (startFunc: ConstructFunction<S, P>, changedFunc?: ChangedFunction<S, P>): DoWhen<S, Value<S>, P>
export default function forEachEntry<S, P> (defaultValue?: Value<S>, changedFunc: ChangedFunction<S, P>): DoWhen<S, Value<S>, P>
export default function forEachEntry<S, I, P> (defaultValue?:  (item: I) => Value<S>, changedFunc: ChangedFunction<S, P>): DoWhen<S, Value<S>, P>

// Can't distinguish a object from an function with flow, so this will not give 
export default function forEachEntry<S> (defaultValue: Value<S>): ChainFunctions<S, Value<S>>
export default function forEachEntry<S, I> (defaultValue: (item: I) => Value<S>): ChainFunctions<S, I>
