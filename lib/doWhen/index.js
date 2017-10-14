'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createNext = require('./../_libs/createNext');

var _createNext2 = _interopRequireDefault(_createNext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function shallowDiffers(a, b) {
  if (a === b) return false;
  for (var i in a) {
    if (!(i in b)) return true;
  }for (var _i in b) {
    if (a[_i] !== b[_i]) return true;
  }return false;
}

var doWhen = function doWhen(selector, constructMock, destructMock) {
  return function (checkFunc) {
    var destructFuncs = {};
    var destructKeys = void 0;

    var callFunc = function callFunc() {
      return function (func, args, key) {

        var index = destructKeys.indexOf(key);
        if (index > -1) destructKeys.splice(index, 1);

        if (destructFuncs[key] === undefined) {
          if (constructMock) {
            constructMock(func, args, key);
          } else {
            destructFuncs[key] = (0, _createNext2.default)(function (next) {
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
    };

    var oldState = {};

    var construct = function construct(state) {
      var newState = selector(state);
      if (shallowDiffers(oldState, newState)) {
        destructKeys = Object.keys(destructFuncs);
        checkFunc(newState, callFunc());

        destructKeys.forEach(function (key) {
          if (destructFuncs[key]) {
            destructFuncs[key]();
          }
        });

        oldState = newState;
      }
    };
    construct.with = function (selector) {
      return doWhen(selector, constructMock, destructMock)(checkFunc);
    };
    construct.mock = function (call, destruct) {
      return doWhen(selector, call, destruct)(checkFunc);
    };
    construct.map = construct.with;
    return construct;
  };
};

exports.default = doWhen(function (s) {
  return s;
});