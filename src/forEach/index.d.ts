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

interface DependencyOptions1<I, E1> extends Options<I> {
  and: [(state: I) => E1]
}

interface DependencyOptions2<I, E1, E2> extends Options<I> {
  and: [(state: I) => E1, (state: I) => E2]
}


// No arguments
export default function forEach<S>(): ChainFunctions<S, Array<S>>;

// Options
export default function forEach<S>(
  options: Options<S>
): DoWhen<S, Array<S>>;

// Map Selector
export default function forEach<S, I>(
  mapValue: (item: I) => Array<S>
): ChainFunctions<S, I>;

// Map & options
export default function forEach<S, I>(
  mapValue: (item: I) => Array<S>,
  options: Options<S> | ConstructFunction<S>
): DoWhen<S, I>;

// // Dependencies 1
// export default function forEach<S, I, E1>(
//   mapValue: (item: I) => Array<S>,
//   options: DependencyOptions1<S, E1>
// ): ((state: I, e1: E1, ...rest: any[]) => void);

// // Dependencies 2
// export default function forEach<S, I, E1, E2>(
//   mapValue: (item: I) => Array<S>,
//   options: DependencyOptions2<S, E1, E2>
// ): ((state: I, e1: E1, e2: E2, ...rest: any[]) => void);

