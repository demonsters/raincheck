"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var makeConstruct = function makeConstruct(constructFn) {
  var selector = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function (s) {
    return s;
  };
  var constructMock = arguments[2];
  var destructMock = arguments[3];

  var construct = constructFn(selector, constructMock, destructMock);
  construct.with = function (newSelector) {
    return makeConstruct(constructFn, function (s) {
      return selector(newSelector(s));
    }, constructMock, destructMock);
  };
  construct.mock = function (constructMock, destructMock) {
    return makeConstruct(constructFn, selector, constructMock, destructMock);
  };
  construct.map = construct.with;
  return construct;
};
exports.default = makeConstruct;