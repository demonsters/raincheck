
import {DoWhen, ConstructFunction} from '../_libs/createConstruct'

// export default function doForAllKeys<S> (startFunc: ConstructFunction<S> ): DoWhen<S, Array<S>>


type KeyExtractor <S> = (item: S, index: number) => string | number

type ChangedFunction<S> = (newValue: S, oldValue: S, key: string | number) => void

type DoOptions<S> = {
  keyExtractor?: KeyExtractor <S>,
  changed?: ChangedFunction<S>
}

interface Options<S, P> extends DoOptions<S> {
  do: ConstructFunction<S, P>
}

export default function forEach<S, P> (startFunc: ConstructFunction<S, P> ): DoWhen<S, Array<S>, P>
export default function forEach<S, P> (defaultValue: Array<S>, options: Options<S, P> | ConstructFunction<S, P> ): DoWhen<S, Array<S>, P>


type ChainFunctions<S> = {
  do: <P>(func: ConstructFunction<S, P>, options?: DoOptions<S> | ChangedFunction<S>) => DoWhen<S, Array<S>, P>
}

export default function forEach<S> (defaultValue?: Array<S> ): ChainFunctions<S>
