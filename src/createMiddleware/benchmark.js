/* eslint-env mocha */
/* global suite, benchmark */

var Benchmark = require('benchmark');

import createMiddelware1 from ".";


const createMiddelware2 = (...actors) => {
  return store => next => action => {
    const ret = next(action)
    const state = store.getState()
    actors.forEach(actor => actor(state, store, action))
    return ret
  }
}

let count = 0

const func = () => count++ % 2
const store = {
  getState: () => ({})
}
const action = {type: ""}

const middleware1 = createMiddelware1(
  func,
  func,
  func,
  func
)(store)(() => {})

const middleware2 = createMiddelware2(
  func,
  func,
  func,
  func
)(store)(() => {})


var suite = new Benchmark.Suite('createMiddleware');

suite
  .add('forEach', function () {
    // func()
    middleware2(action)
  })
  .add('chain', function () {
    // func()
    middleware1(action)
  })
  .on('cycle', function(event) {
    console.log(String(event.target));
  })
  .on('complete', function() {
    const fastest = this.filter('fastest')
    const slowest = this.filter('slowest')
    // console.log("", fastest)
    console.log('fastest', fastest[0].name, fastest[0].times);
    console.log('slowest', slowest[0].name, slowest[0].times);
  })
  .run({ 'async': false });
