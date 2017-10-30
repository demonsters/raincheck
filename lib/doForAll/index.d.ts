
import {DoWhen, ConstructFunction} from '../_libs/createConstruct'

type ChangedFunction<S> = (newValue: S, oldValue: void | S, ...args: any[]) => void

export default function doForAll<S> (startFunc: ConstructFunction<S>, changedFunc?: ChangedFunction<S>): DoWhen<S, {[key: string]: S}>

