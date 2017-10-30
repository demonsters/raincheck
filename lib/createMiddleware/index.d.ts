// @flow

import {MiddlewareAPI, Middleware} from 'redux'
import {DoWhen} from '../_libs/createConstruct'

export default function createMiddleware<S, A> (...funcs: Array<DoWhen<S, any>>): Middleware

