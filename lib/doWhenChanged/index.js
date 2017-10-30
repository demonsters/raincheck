'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = doWhenChanged;

var _createChainAPI = require('./../_libs/createChainAPI');

var _createChainAPI2 = _interopRequireDefault(_createChainAPI);

var _createConstruct = require('../_libs/createConstruct');

var _createConstruct2 = _interopRequireDefault(_createConstruct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doWhenChanged(changedFunc) {

  // if (typeof changedFunc === 'object') {
  //   const obj = changedFunc
  //   changedFunc = (...args) => {
  //     obj.begin.apply(obj, args)
  //     return () => obj.end.apply(obj)
  //   }
  // }

  return (0, _createConstruct2.default)(function (selector, constructMock, destructMock) {

    var oldState = undefined;
    var destruct = void 0;

    return function (state) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var newState = selector(state);
      if (newState !== oldState) {
        if (destruct) destruct();
        if (newState !== undefined) {
          if (constructMock) {
            constructMock(changedFunc, newState, oldState); // need key?
          } else {
            destruct = (0, _createChainAPI2.default)(function (next) {
              return changedFunc.apply(undefined, [newState, oldState, next].concat(args));
            });
          }
        }
        oldState = newState;
      }
    };
  });
}