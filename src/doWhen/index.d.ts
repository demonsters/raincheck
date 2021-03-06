

import {DoWhen, DestructFunction} from '../_libs/createConstruct'
import { ChainAPI } from '../_libs/createChainAPI';

//
type ConstructFunction<P> = (props: P, chainAPI?: ChainAPI) => DestructFunction

export type CallFunction<S> = <P>(funct: ConstructFunction<P>, props: P, key?: string ) => void

type CheckerFunction<S> = (props: S, call: CallFunction<S>) => void

export default function doWhen<S> (func: CheckerFunction<S> ): DoWhen<S, S>
