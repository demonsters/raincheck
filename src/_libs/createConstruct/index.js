
const makeConstruct = (constructFn, selector = s => s, constructMock, destructMock) => {
  const construct = constructFn(selector, constructMock, destructMock)
  construct.with = (newSelector) => makeConstruct(constructFn, s => newSelector(selector(s)), constructMock, destructMock)
  construct.mock = (constructMock, destructMock) => makeConstruct(constructFn, selector, constructMock, destructMock)
  construct.map = construct.with
  return construct
}
export default makeConstruct
