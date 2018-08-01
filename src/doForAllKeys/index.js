
import forEach from '../forEach'


/**
 * @deprecated use 'forEachKey' instead
 */
export default (startFunc) => {
  console.warn("doForAllKeys is deprecated use 'forEachKey' instead")
  return forEach().do(startFunc)
}
