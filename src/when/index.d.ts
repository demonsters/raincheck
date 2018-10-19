// @flow

import {DoWhen, DestructFunction, ConstructFunction} from '../_libs/createConstruct'

type ChangedFunction<S> = (newValue: S, oldValue: S, ...args: any[]) => void | DestructFunction


type Value = { [key: string]: any } | null | false | void

type ChainFunctions<S, I> = {
  do: <P>(startFunc: ConstructFunction<S>) => DoWhen<S, I>
}

// export default function when<S extends Value> (defaultValue: any ): ChainFunctions<S, S>
// export default function when<S, I> (defaultValue: (item: I) => Value<S> ): ChainFunctions<S, S>


// No arguments
export default function when<O> (): ChainFunctions<O, O>

// Map value
export default function when<O, I> (mapValue: (item: I) => O): ChainFunctions<O, I>

// Settings
export default function when<O, I> (settings: {
  do: ConstructFunction<O>
}): DoWhen<O, I>

// Map value and settings
export default function when<O, I> (mapValue: (item: I) => O, settings: {
  do: ConstructFunction<O>
}): DoWhen<O, I>
