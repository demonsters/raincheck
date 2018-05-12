import createNext from './../_libs/createChainAPI';
import createConstruct from '../_libs/createConstruct';
import doWhen from '../doWhen'

export default function doWhenTrue(constructFunc) {
  return doWhen((state, call) => {
    if (state) call((val, next) => constructFunc(next))
  })
}
