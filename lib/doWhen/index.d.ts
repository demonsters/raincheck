

import {DoWhen, ConstructFunction} from '../_libs/createConstruct'

type NextFunction = (destructFunction: DestructFunction) => void
type DestructFunction = () => void

export type CallFunction<P extends Array<any>> = (funct: ConstructFunction<P>, params: P | string, key?: string ) => void

type CheckerFunction<S, P extends Array<any>> = (props: S, call: CallFunction<P>) => void

export default function doWhen<S, P extends Array<any>> (func: CheckerFunction<S, P> ): DoWhen<S, S>
