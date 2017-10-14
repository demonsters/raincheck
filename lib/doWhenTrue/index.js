'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createNext = require('./../_libs/createNext');

var _createNext2 = _interopRequireDefault(_createNext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var doWhenTrue = function doWhenTrue(selector, constructMock) {
  return function (constructFunc) {
    var oldState = void 0;
    var destruct = void 0;

    var construct = function construct(state) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var newState = selector(state);
      if (newState !== oldState) {
        oldState = newState;
        if (newState) {
          if (constructMock) {
            constructMock(constructFunc);
          } else {
            destruct = (0, _createNext2.default)(function (next) {
              return constructFunc.apply(undefined, [next].concat(args));
            });
          }
        } else if (destruct) {
          destruct();
        }
      }
    };
    construct.mock = function (constructMock) {
      return doWhenTrue(selector, constructMock)(constructFunc);
    };
    construct.with = function (newSelector) {
      return doWhenTrue(function (s) {
        return newSelector(selector(s));
      }, constructMock)(constructFunc);
    };
    construct.map = construct.with;
    return construct;
  };
};

// TODO: with = map

exports.default = doWhenTrue(function (s) {
  return s;
});