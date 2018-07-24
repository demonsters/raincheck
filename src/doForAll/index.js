
import forEachEntry from '../forEachEntry'

/**
 * @deprecated use 'forEachEntry' instead
 */
export default (...props) => {
  console.warn("doForAll is deprecated use 'forEachEntry' instead")
  return forEachEntry().do(...props)
}
