
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


// No arguments
export default function forEachEntry<O> (): ChainFunctions<O, Value<O>>

// Map 
export default function forEachEntry<O, I> (mapValue: (item: I) => Value<O>): ChainFunctions<O, I>

// Map & change function
export default function forEachEntry<O, I, P> (mapValue:  (item: I) => Value<O>, changedFunc: ChangedFunction<O>): DoWhen<O, I>

// Settings
export default function forEachEntry<O, P> (settings: {
  do: ConstructFunction<O>, 
  changed?: ChangedFunction<O>, 
}): DoWhen<O, Value<O>>
