'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createMiddleware = exports.doForAllKeys = exports.doForAll = exports.doWhenChanged = exports.doWhenTrue = exports.doWhen = undefined;

var _doWhen = require('./doWhen');

var _doWhen2 = _interopRequireDefault(_doWhen);

var _doWhenTrue = require('./doWhenTrue');

var _doWhenTrue2 = _interopRequireDefault(_doWhenTrue);

var _doWhenChanged = require('./doWhenChanged');

var _doWhenChanged2 = _interopRequireDefault(_doWhenChanged);

var _createMiddleware = require('./createMiddleware');

var _createMiddleware2 = _interopRequireDefault(_createMiddleware);

var _doForAll = require('./doForAll');

var _doForAll2 = _interopRequireDefault(_doForAll);

var _doForAllKeys = require('./doForAllKeys');

var _doForAllKeys2 = _interopRequireDefault(_doForAllKeys);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// doForList
//

// TODO: Clearer names:

// TODO: More unit tests?
// TODO: flow

// raincheck !!

// although
// wheneverjs
// meanwhilejs
// meantime
// conditionjs
// state-observe
// state-react
// on-state
// state-act
// act-on
// acton
// call-when
// call-on
// call-on-me :)
// act-when
// redux-do-when
// act-on-state
// do-when-changed
// state-watch

// beetje ver gezocht misschien:
// seasonal


// obtainer
// redux-act-on
// conditional-side-effects


exports.doWhen = _doWhen2.default;
exports.doWhenTrue = _doWhenTrue2.default;
exports.doWhenChanged = _doWhenChanged2.default;
exports.doForAll = _doForAll2.default;
exports.doForAllKeys = _doForAllKeys2.default;
exports.createMiddleware = _createMiddleware2.default;

// doForAllObjects ??
// doFor ??

// act(() => {}).forAll()

// doWhen(isLoggedIn, connect).then()

// doWhen(isLogginIn, connect).observe(observable => observable.)

/*
doWhenTrue()
  .map(s => s.value)
  .then(connect)
  .check({value: true})
*/


// doWhen((state, call) => {
//   Object.keys(state).map((object, key) => call(func, [object], item))
// })(["key1"])

// doForAll(object => func(object))(["key1": {object: "adfa"}])


// doWhen((state, call) => {
//   state.map(item => call(func, [item], item))
// })(["key1"])

// doForAllKeys(key => func(key))(["key1"])