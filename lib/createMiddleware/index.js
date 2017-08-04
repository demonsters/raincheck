"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, actors = Array(_len), _key = 0; _key < _len; _key++) {
    actors[_key] = arguments[_key];
  }

  return function (store) {
    return function (next) {
      return function (action) {
        var ret = next(action);
        actors.forEach(function (actor) {
          return actor(store.getState(), store, action);
        });
        return ret;
      };
    };
  };
};