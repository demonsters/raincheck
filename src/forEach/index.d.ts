// @flow

import { DoWhen, ConstructFunction } from "../_libs/createConstruct";
import { DestructFunction, ChainAPI } from "../_libs/createChainAPI";

type KeyExtractor<S> = (item: S, index: number) => string | number;

type ChangedFunction<S> = (
  newValue: S,
  oldValue: S,
  key: string | number
) => void;

type DoOptions<S> = {
  keyExtractor?: KeyExtractor<S>;
  changed?: ChangedFunction<S>;
};

interface Options<I> extends DoOptions<I> {
  do: <S>(value: S | I, next: ChainAPI, ...args: any[]) => void | DestructFunction;
}

type ChainFunctions<S, I> = {
  do: <P>(func: ConstructFunction<S>, options?: DoOptions<S> | ChangedFunction<S>) => DoWhen<S, I>;
};


export default function forEach<S>(defaultValue: Array<S>, options: Options<S> | ConstructFunction<S>): DoWhen<S, Array<S>>;
export default function forEach<S, I>(mapValue: (item: I) => Array<S>, options: Options<S> | ConstructFunction<S>): DoWhen<S, I>;

export default function forEach<S>(defaultValue?: Array<S>): ChainFunctions<S, Array<S>>;
export default function forEach<S, I>(mapValue: (item: I) => Array<S>): ChainFunctions<S, I>;
