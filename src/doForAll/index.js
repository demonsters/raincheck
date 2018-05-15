
import forEachKey from '../forEachKey'

export default (...props) => {
  console.log("doForAll is deprecated use 'forEachKey' instead")
  return forEachKey(...props)
}
