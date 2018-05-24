// @flow

import {DoWhen, DestructFunction, ConstructFunction} from '../_libs/createConstruct'

type ChangedFunction<S> = (newValue: S, oldValue: S, ...args: any[]) => void | DestructFunction


type Value = { [key: any]: any } | null | false | void

type ChainFunctions<S, I> = {
  do: <P>(startFunc: ConstructFunction<S, P>, changedFunc?: ChangedFunction<S, P>) => DoWhen<S, I, P>
}

export default function when<S extends Value> (defaultValue: any ): ChainFunctions<S, S>
export default function when<S, I> (defaultValue: (item: I) => Value<S> ): ChainFunctions<S, S>
