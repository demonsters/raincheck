
import forEachKey from '../forEachKey'

export default (...props) => {
  console.log("doForAll is deprecated")
  return forEachKey(...props)
}
