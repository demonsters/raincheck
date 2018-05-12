'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = doWhenTrue;

var _createChainAPI = require('./../_libs/createChainAPI');

var _createChainAPI2 = _interopRequireDefault(_createChainAPI);

var _createConstruct = require('../_libs/createConstruct');

var _createConstruct2 = _interopRequireDefault(_createConstruct);

var _doWhen = require('../doWhen');

var _doWhen2 = _interopRequireDefault(_doWhen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doWhenTrue(constructFunc) {
  return (0, _doWhen2.default)(function (state, call) {
    if (state) call(function (val, next) {
      return constructFunc(next);
    });
  });
}