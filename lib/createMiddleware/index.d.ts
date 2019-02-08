// @flow

import {MiddlewareAPI, Middleware} from 'redux'
import {DoWhen} from '../_libs/createConstruct'

export default function createMiddleware<S> (...funcs: Array<DoWhen<any, S>>): Middleware

