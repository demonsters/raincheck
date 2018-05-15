
import forEach from '../forEach'

export default (...props) => {
  console.log("doForAllKeys is deprecated use 'forEachKey' instead")
  return forEach(...props)
}
