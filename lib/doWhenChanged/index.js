"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (selector, func) {
  var oldState = void 0;
  return function (store, action) {
    var val = selector(store.getState());
    if (val !== oldState) {
      oldState = val;
      func(store);
    }
  };
};