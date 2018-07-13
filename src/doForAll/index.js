
import forEachEntry from '../forEachEntry'

export default (...props) => {
  console.log("doForAll is deprecated use 'forEachEntry' instead")
  return forEachEntry().do(...props)
}
