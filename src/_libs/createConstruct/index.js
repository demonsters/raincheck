
const makeConstruct = (constructFn, selector = s => s, constructMock, destructMock, filterFunc = () => true) => {
  const construct = constructFn(selector, constructMock, destructMock, filterFunc)
  construct.with = (newSelector) => makeConstruct(constructFn, s => selector(newSelector(s)), constructMock, destructMock, filterFunc)
  construct.mock = (constructMock, destructMock) => makeConstruct(constructFn, selector, constructMock, destructMock, filterFunc)
  construct.map = construct.with
  construct.filter = (newFilterFunc) => makeConstruct(constructFn, selector, constructMock, destructMock, (item) => {
    if (!filterFunc(item)) {
      return false
    }
    return newFilterFunc(item)
  })
  return construct
}
export default makeConstruct
