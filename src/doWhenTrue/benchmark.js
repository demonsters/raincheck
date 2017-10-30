// @flow
/* eslint-env mocha */
/* global suite, benchmark */

var Benchmark = require('benchmark');

import doWhenTrue from '.'
import doWhen from '../doWhen'


const construct = () => {
  /o/.test('Hello World!')
}

let doWhenTrueCount = 0
let doWhenCount = 0

const doWhenTrueFn = doWhenTrue(construct)
const doWhenFn = doWhen((value, call) => {
  if (value) {
    call(construct)
  }
})

var suite = new Benchmark.Suite('doWhenTrue');

suite
  .add('doWhenTrue', function () {
    return doWhenTrueFn(!!(doWhenTrueCount++ % 2))
  })
  .add('doWhen', function () {
    return doWhenFn(doWhenCount++ % 2)
  })
  .on('complete', function() {
    const fastest = this.filter('fastest')
    const slowest = this.filter('slowest')
    console.log('fastest', fastest[0].name, fastest[0].times);
    console.log('slowest', slowest[0].name, slowest[0].times);
  })
  .run({ 'async': true });
