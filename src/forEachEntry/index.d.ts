
import {DoWhen, ConstructFunction} from '../_libs/createConstruct'
import { ChainAPI, DestructFunction } from '../_libs/createChainAPI';

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
export default function forEachEntry<O> (): ChainFunctions<O, Value<O>>;

// Map 
export default function forEachEntry<O, I> (mapValue: (item: I) => Value<O>): ChainFunctions<O, I>;

// Map & change function
export default function forEachEntry<O, I, P> (mapValue:  (item: I) => Value<O>, changedFunc: ChangedFunction<O>): DoWhen<O, I>;

// Settings
export default function forEachEntry<O, P> (settings: {
  withKey?: false,
  do: ConstructFunction<O>, 
  changed?: ChangedFunction<O>, 
}): DoWhen<O, Value<O>>;

// withKey
export default function forEachEntry<O, P> (settings: {
  withKey: true,
  do: (value: O, key: string, next: ChainAPI, ...args: any[]) => void | DestructFunction, 
  changed?: ChangedFunction<O>, 
}): DoWhen<O, Value<O>>;

// Dependancies 1
export default function forEachEntry<O, I, P, D1> (mapValue:  (item: I) => Value<O>, settings: {
  withKey?: boolean,
  do: (value: O, d1: D1, next: ChainAPI, ...args: any[]) => void | DestructFunction, 
  when: [(state: I) => D1]
  changed?: ChangedFunction<O>, 
}): DoWhen<O, Value<O>>;

// Dependancies 2
export default function forEachEntry<O, I, P, D1, D2> (mapValue:  (item: I) => Value<O>, settings: {
  withKey?: boolean,
  do: (value: O, d1: D1, d2: D2, next: ChainAPI, ...args: any[]) => void | DestructFunction, 
  when: [(state: I) => D1, (state: I) => D2]
  changed?: ChangedFunction<O>, 
}): DoWhen<O, Value<O>>;

// Dependancies 3
export default function forEachEntry<O, I, P, D1, D2, D3> (mapValue:  (item: I) => Value<O>, settings: {
  withKey?: boolean,
  do: (value: O, d1: D1, d2: D2, d3: D3, next: ChainAPI, ...args: any[]) => void | DestructFunction, 
  when: [(state: I) => D1, (state: I) => D2, (state: I) => D3]
  changed?: ChangedFunction<O>, 
}): DoWhen<O, Value<O>>;
