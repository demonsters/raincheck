// @flow

import {DoWhen, DestructFunction, ConstructFunction} from '../_libs/createConstruct'
import { ChainAPI } from '../_libs/createChainAPI';

type ChangedFunction<S> = (newValue: S, oldValue: S, ...args: any[]) => void | DestructFunction


type Value = { [key: string]: any } | null | false | void

type ChainFunctions<S, I> = {
  do: <P>(startFunc: ConstructFunction<S>) => DoWhen<S, I>
}

// export default function when<S extends Value> (defaultValue: any ): ChainFunctions<S, S>
// export default function when<S, I> (defaultValue: (item: I) => Value<S> ): ChainFunctions<S, S>



// No arguments
export default function when<O> (): ChainFunctions<O, O>;

// Map value
export default function when<O, I> (mapValue: (item: I) => O): ChainFunctions<O, I>;

// Settings
export default function when<O, I> (settings: {
  do: ConstructFunction<O>
}): DoWhen<O, I>;

// Map value and settings
export default function when<O, I> (mapValue: (item: I) => O, settings: {
  do: ConstructFunction<O>
}): DoWhen<O, I>;


// Dependencies 1
export default function when<O, I, D1>(
  mapValue: (item: I) => O,
  options: {
    do: (value: O, d1: D1, next: ChainAPI, ...args: any[]) => void | DestructFunction,
    and: [(state: I) => D1]
  }
): DoWhen<O, I>;

// Dependencies 2
export default function when<O, I, D1, D2>(
  mapValue: (item: I) => O,
  options: {
    do: (value: O, d1: D1, d2: D2, next: ChainAPI, ...args: any[]) => void | DestructFunction,
    and: [(state: I) => D1, (state: I) => D2]
  }
): DoWhen<O, I>;
