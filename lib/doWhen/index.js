"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (selector, func) {
  var oldState = void 0;
  var destruct = void 0;
  return function (state) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var val = selector(state);
    if (val !== oldState) {
      oldState = val;
      if (val) {
        destruct = func.apply(undefined, [function (d) {
          return destruct = d;
        }].concat(args));
      } else if (destruct) {
        destruct();
      }
    }
  };
};