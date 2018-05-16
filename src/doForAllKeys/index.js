
import forEach from '../forEach'

export default (startFunc) => {
  console.log("doForAllKeys is deprecated use 'forEachKey' instead")
  return forEach().do(startFunc)
}
