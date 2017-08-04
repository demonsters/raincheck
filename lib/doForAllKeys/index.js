"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (selector, startFunc) {

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
        destructFuncs[key] = startFunc.apply(undefined, [key].concat(args));
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
};