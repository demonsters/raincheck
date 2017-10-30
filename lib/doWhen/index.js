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

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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

    var callFunc = function callFunc(func, args, key) {

      if (key === undefined) {
        if (typeof args === 'string') {
          key = args;
          args = [key];
        }
      }

      var index = destructKeys.indexOf(key);
      if (index > -1) destructKeys.splice(index, 1);

      if (destructFuncs[key] === undefined) {
        if (constructMock) {
          constructMock(func, args, key);
        } else {
          destructFuncs[key] = (0, _createChainAPI2.default)(function (next) {
            return func.apply(undefined, _toConsumableArray(args).concat([next]));
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
        checkFunc(newState, callFunc);

        destructKeys.forEach(function (key) {
          if (destructFuncs[key]) {
            destructFuncs[key]();
          }
        });

        oldState = newState;
      }
    };
  });
}