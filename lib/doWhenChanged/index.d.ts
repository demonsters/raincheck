// @flow

import {DoWhen, DestructFunction} from '../_libs/createConstruct'

type ChangedFunction<S> = (newValue: S, oldValue: S, ...args: any[]) => void | DestructFunction

export default function doWhenChanged<S, A> (func: ChangedFunction<S> ): DoWhen<S, S>
