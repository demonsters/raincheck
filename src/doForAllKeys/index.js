
import forEach from '../forEach'

export default (...props) => {
  console.log("doForAllKeys is deprecated")
  return forEach(...props)
}
