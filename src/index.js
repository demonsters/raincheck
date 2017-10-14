
// TODO: More unit tests?
// TODO: flow

// act-on
// acton
// call-when
// call-on
// call-on-me :)
// act-when
// redux-do-when
// act-on-state

// beetje ver gezocht misschien:
// seasonal


// obtainer
// redux-act-on
// conditional-side-effects


import doWhen from './doWhen'
import doWhenTrue from './doWhenTrue'
import doWhenChanged from './doWhenChanged'
import createMiddleware from './createMiddleware'

// TODO: Clearer names:
import doForAll from './doForAll'


// doWhen((state, call) => {
//   Object.keys(state).map((object, key) => call(func, [object], item))
// })(["key1"])

// doForAll(object => func(object))(["key1": {object: "adfa"}])


// doWhen((state, call) => {
//   state.map(item => call(func, [item], item))
// })(["key1"])

// doForAllKeys(key => func(key))(["key1"])



import doForAllKeys from './doForAllKeys'

// doForList
//

export {
  doWhen,
  doWhenTrue,
  doWhenChanged,
  doForAll,
  doForAllKeys,
  createMiddleware
}

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
