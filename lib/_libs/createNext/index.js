'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var createNext = function createNext(parentFunc) {

  var doNext = function doNext() {
    for (var _len = arguments.length, creators = Array(_len), _key = 0; _key < _len; _key++) {
      creators[_key] = arguments[_key];
    }

    // call all creators, and add the destruct returns into an array
    var destructs = creators.map(function (creator) {

      if (!creator) {
        return null;
      }

      var destruct = void 0;

      var next = createNext(function (d, doDestruct) {

        if (doDestruct) {
          destructs = destructs.filter(function (d) {
            return d !== destruct;
          });
        }

        // Add the new destruct function
        destructs.push(d);
      });

      destruct = creator(next);
      if (!destruct) {
        return null;
      }

      return destruct;
    });

    // Create a new destruct which calls all destructs
    var destruct = function destruct() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      destructs.forEach(function (destruct) {
        destruct && typeof destruct === 'function' && destruct.apply(undefined, args);
      });
      destructs.length = 0;
    };

    parentFunc(destruct, creators[0] !== false);

    return destruct;
  };

  var next = function next() {
    return doNext.apply(undefined, arguments);
  };
  next.branch = function () {
    for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }

    return doNext.apply(undefined, [false].concat(args));
  };
  next.complete = doNext;
  next.resolve = doNext;
  next.chain = doNext;

  return next;
};

exports.default = createNext(function () {});