'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = doForAllKeys;

var _createChainAPI = require('./../_libs/createChainAPI');

var _createChainAPI2 = _interopRequireDefault(_createChainAPI);

var _createConstruct = require('../_libs/createConstruct');

var _createConstruct2 = _interopRequireDefault(_createConstruct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doForAllKeys(constructFunc) {

  return (0, _createConstruct2.default)(function (selector, constructMock, destructMock) {

    var cachedObjects = [];
    var destructFuncs = {};

    return function (state) {
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
            destructFuncs[key] = (0, _createChainAPI2.default)(function (next) {
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
  });
}