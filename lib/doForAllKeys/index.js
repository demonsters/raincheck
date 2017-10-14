'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createNext = require('./../_libs/createNext');

var _createNext2 = _interopRequireDefault(_createNext);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var doForAllKeys = function doForAllKeys(selector, constructMock, destructMock) {
  return function (constructFunc) {

    var cachedObjects = [];
    var destructFuncs = {};

    // Create the next function
    // const createNext = key => destructFunc => {
    //   destructFuncs[key] = destructFunc
    // }

    var construct = function construct(state) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var objects = selector(state);

      if (objects === cachedObjects) {
        return;
      }

      var destructObjects = cachedObjects.concat();

      objects.forEach(function (key) {
        if (cachedObjects.indexOf(key) === -1) {
          if (constructMock) {
            constructMock(constructFunc, key);
          } else {
            destructFuncs[key] = (0, _createNext2.default)(function (next) {
              return constructFunc.apply(undefined, [key, next].concat(args));
            });
          }
        }
        // Remove so it will not be destructed below
        var index = destructObjects.indexOf(key);
        if (index > -1) {
          destructObjects.splice(index, 1);
        }
      });

      destructObjects.forEach(function (key) {
        if (destructFuncs[key]) {
          destructFuncs[key](destructObjects[key]);
        }
      });

      cachedObjects = objects;
    };

    construct.mock = function (constructMock, destructMock) {
      return doForAllKeys(selector, constructMock, destructMock)(constructFunc);
    };
    construct.with = function (selector) {
      return doForAllKeys(selector)(constructFunc);
    };
    construct.map = construct.with;
    return construct;
  };
};

exports.default = doForAllKeys(function (s) {
  return s;
});