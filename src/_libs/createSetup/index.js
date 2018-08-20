
export default (create) => (selector, options) => {

  if (typeof selector !== "function") {
    options = selector
    selector = s => s
  }
  
  if (options) {
    if (typeof options === "function") {
      return create(selector, options)
    }
    if (options.do) {
      return create(selector, options.do, options.changed, options.keyExtractor)
    }
  }

  return {
    do: (constructFunc, o) => {
      o = {
        ...options,
        ...o,
      }
      return create(selector, constructFunc, o.changed, o.keyExtractor)
    }
  }

}

