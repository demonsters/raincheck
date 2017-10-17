'use strict';

var _ = require('.');

var _2 = _interopRequireDefault(_);

var _doWhen = require('../doWhen');

var _doWhen2 = _interopRequireDefault(_doWhen);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-env mocha */
/* global suite, benchmark */

var Benchmark = require('benchmark');

var construct = function construct() {
  return (/o/.test('Hello World!')
  );
};

var doWhenTrueCount = 0;
var doWhenCount = 0;

var doWhenTrueFn = (0, _2.default)(construct);
var doWhenFn = (0, _doWhen2.default)(function (value, call) {
  if (value) {
    call(construct);
  }
});

var suite = new Benchmark.Suite('doWhenTrue');

suite.add('doWhenTrue', function () {
  return doWhenTrueFn(doWhenTrueCount++ % 2);
}).add('doWhen', function () {
  return doWhenFn(doWhenCount++ % 2);
}).on('complete', function () {
  var fastest = this.filter('fastest');
  var slowest = this.filter('slowest');
  console.log('fastest', fastest[0].name, fastest[0].times);
  console.log('slowest', slowest[0].name, slowest[0].times);
}).run({ 'async': true });