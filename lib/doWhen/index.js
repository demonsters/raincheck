'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.default = doWhen;

var _createChainAPI = require('./../_libs/createChainAPI');

var _createChainAPI2 = _interopRequireDefault(_createChainAPI);

var _createConstruct = require('../_libs/createConstruct');

var _createConstruct2 = _interopRequireDefault(_createConstruct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function shallowDiffers(a, b) {
  if (a === b) return false;
  if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== 'object' || (typeof b === 'undefined' ? 'undefined' : _typeof(b)) !== 'object') return true;
  for (var i in a) {
    if (!(i in b)) return true;
  }for (var _i in b) {
    if (a[_i] !== b[_i]) return true;
  }return false;
}

function doWhen(checkFunc) {

  return (0, _createConstruct2.default)(function (selector, constructMock, destructMock) {

    var destructFuncs = {};
    var destructKeys = void 0;

    var callFunc = function callFunc(func, props, key) {

      if (key === undefined) {
        if (typeof props === 'string') {
          key = props;
        } else {
          key = "default";
        }
      }

      var index = destructKeys.indexOf(key);
      if (index > -1) destructKeys.splice(index, 1);

      if (destructFuncs[key] === undefined) {
        if (constructMock) {
          constructMock(func, props, key);
        } else {
          destructFuncs[key] = (0, _createChainAPI2.default)(function (next) {
            return func(props, next);
          });
        }
        if (destructMock) {
          destructFuncs[key] = function () {
            return destructMock(key);
          };
        }
        if (!destructFuncs[key]) {
          destructFuncs[key] = null;
        }
      }
    };

    var oldState = {};

    return function (state, args) {
      var newState = selector(state);
      if (shallowDiffers(oldState, newState)) {
        destructKeys = Object.keys(destructFuncs);

        oldState = newState;

        checkFunc(newState, callFunc);

        destructKeys.forEach(function (key) {
          if (destructFuncs[key]) {
            destructFuncs[key]();
          }
        });
      }
    };
  });
}