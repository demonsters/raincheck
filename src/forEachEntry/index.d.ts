
import {DoWhen, ConstructFunction} from '../_libs/createConstruct'

type ChangedFunction<S> = (newValue: S, oldValue?: S, ...args: Array<any>) => void

type Options<S> = {
  do: ConstructFunction<S>,
  changed?: ChangedFunction<S>
}

// type CallableObject = {|
//   (...r: Array<any>): any
// |}

type Value<S> = { [key: string]: S } | null | false | void


type ChainFunctions<S, I> = {
  do: (startFunc: ConstructFunction<S>, changedFunc?: ChangedFunction<S>) => DoWhen<S, I>
}


// declare export default function forEachEntry<S, P> (startFunc: ConstructFunction<S, P>, changedFunc?: ChangedFunction<S, P>): DoWhen<S, Value<S>, P>
export default function forEachEntry<S> (defaultValue: Value<S> | void, changedFunc: ChangedFunction<S>): DoWhen<S, Value<S>>
export default function forEachEntry<S, I> (defaultValue:  (item: I) => Value<S> | void, changedFunc: ChangedFunction<S>): DoWhen<S, Value<S>>

// Can't distinguish a object from an function with flow, so this will not give 
export default function forEachEntry<S, I> (defaultValue?: Value<S>): ChainFunctions<S, Value<S>>
export default function forEachEntry<S, I> (defaultValue?: (item: I) => Value<S>): ChainFunctions<S, I>
