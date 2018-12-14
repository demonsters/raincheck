
import when from '../when'
import forEach from '../forEach';
import forEachEntry from '../forEachEntry';

const createChainableDo = (when, selector) => {

  // Loosing filter/map functionality here!!
  // So we need filter and map to 

  return {
    ...when,
    do: (...args) => {
      let newDo = when.do(...args)
      newDo.forEach = (newSelect, options) => {
        return forEach((arg) => selector(arg) && newSelect(arg), options)
      }
      newDo.forEachEntry = (newSelect, options) => {
        return forEachEntry((arg) => selector(arg) && newSelect(arg), options)
      }
      newDo.when = (newSelect, options) => {
        return createChainableDo(chain((arg) => selector(arg) && newSelect(arg), options), selector)
      }
      return newDo
    }
  }
}

const chain = (selector, options) => {

  return {
    forEach: (newSelect, options) => {
      return forEach((arg) => selector(arg) && newSelect(arg), options)
    },
    forEachEntry: (newSelect, options) => {
      return forEachEntry((arg) => selector(arg) && newSelect(arg), options)
    },
    when: (newSelect, options) => {
      return createChainableDo(chain((arg) => selector(arg) && newSelect(arg), options), selector)
    },
    do: (constructFunc, o) => {
      o = {
        ...options,
        ...o,
      }
      return when(selector).do(constructFunc, o)
    }
  }

}

export default chain
