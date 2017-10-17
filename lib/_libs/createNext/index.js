'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var createNext = function createNext(parentFunc) {

  var doNext = function doNext(doDestruct) {
    return function () {
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

      parentFunc(destruct, doDestruct);

      return destruct;
    };
  };

  var next = doNext(true);
  next.branch = doNext(false);
  next.complete = next;
  next.resolve = next;
  next.chain = next;
  next.next = next;

  return next;
};

exports.default = createNext(function () {});