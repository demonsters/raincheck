
import {DoWhen, ConstructFunction} from '../_libs/createConstruct'

export default function doForAllKeys<S> (startFunc: ConstructFunction<S> ): DoWhen<S, Array<S>>

