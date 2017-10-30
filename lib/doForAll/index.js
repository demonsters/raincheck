'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = doForAll;

var _createChainAPI = require('../_libs/createChainAPI');

var _createChainAPI2 = _interopRequireDefault(_createChainAPI);

var _createConstruct = require('../_libs/createConstruct');

var _createConstruct2 = _interopRequireDefault(_createConstruct);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function doForAll(constructFunc, changedFunc) {

  return (0, _createConstruct2.default)(function (selector, constructMock, destructMock) {

    // Objects getting mutated!!
    var cachedObjects = {};
    var destructFuncs = {};

    return function (state) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // Get the objects
      var objects = selector(state);

      // Compare the object with the cached version
      if (objects === cachedObjects) {
        return;
      }

      // If objects if falsy cancel all
      if (!objects) {
        Object.keys(destructFuncs).forEach(function (key) {
          if (destructFuncs[key]) {
            destructFuncs[key](cachedObjects[key]);
          }
        });
        destructFuncs = {};
        cachedObjects = {};
        return;
      }

      // Clone cached objects for destruction (mutated!!)
      var destructObjects = _extends({}, cachedObjects);

      // Check if object has added or changed
      Object.keys(objects).forEach(function (key) {
        var object = objects[key];

        // Check if object is new
        if (!cachedObjects.hasOwnProperty(key)) {
          if (constructMock) {
            constructMock(constructFunc, object); // need key?
          } else {
            destructFuncs[key] = (0, _createChainAPI2.default)(function (next) {
              return constructFunc.apply(undefined, [object, next].concat(args));
            });
          }

          // Check if object has changed
        } else if (cachedObjects[key] !== object && changedFunc) {
          changedFunc.apply(undefined, [object, cachedObjects[key]].concat(args));
        }

        // Remove so it will not be destructed below
        delete destructObjects[key];
      });

      // Destruct objects
      Object.keys(destructObjects).forEach(function (key) {
        if (destructFuncs[key]) {

          // Call destruct function
          destructFuncs[key](destructObjects[key]);

          // Remove destruct function
          delete destructFuncs[key];
        }
      });

      // Cache current objects
      cachedObjects = objects;
    };
  });
}