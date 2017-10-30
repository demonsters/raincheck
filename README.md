<p align="center"><img src="logo.png" width="244" width="400px"></p>


Do something when the conditions are right and cancel them if they're not.

Say you want to connect to a socket when you’re logged in and want to disconnect when you’re not. This can only work once the socket url is known.

If you know react, you know that it’s pretty good in these types of situaties. The thing is, a socket isn’t a react element. You could wrap it as react element (start in componentDidMount, end in componentWillUnmount), but that’s a bit awkward. 

This is where raincheck comes to the rescue. Inspired by react & redux.


```javascript

import { doWhen } from 'raincheck'

const connectToSocketWhen = doWhen(({isLoggedIn, url}, call) => {
  if (isLoggedIn && !!url) {
    call(connectToSocket, url, url) 
  }
})

```

This will trigger `connectToSocket()` when the following is called:

```javascript

connectToSocketWhen({
  isLoggedIn: true,
  url: 'ws://socketurl'
})

```

And disconnect when:

```javascript
connectToSocketWhen({
  isLoggedIn: false
})
```

When you call `connectToSocketWhen` again with the same arguments it will not trigger `connectToSocket()` or disconnect. 
To do this `raincheck` works with key's, the same way react does. It's the third argument of the `call` function. 
When the first argument is a string instead of an array it will be used as key and is passed in as argument to `connectToSocket()`, 
so the example above could be simplified to:

```javascript

import { doWhen } from 'raincheck'

const connectToSocketWhen = doWhen(({isLoggedIn, url}, call) => {
  if (isLoggedIn && !!url) {
    call(connectToSocket, url) 
  }
})

```

The `connectToSocket()` can be any function. This function can return a cancel function, which in this case will close the socket:

```javascript
const connectToSocket = (url) => {
  const socket = new WebSocket()
  socket.connect(url)
  return () => socket.close()
}
```

# Redux

`Raincheck` is particularly great when used with Redux.
To connect to a store you use `createMiddleware()`, like so:

```javascript

createMiddleware(
  doWhen(({isLoggedIn, url}, call) => {
    if (isLoggedIn && !!url) {
      call(connectToSocket, url) 
    }
  })
)

```

Each time the state changes the function passed into `doWhen` will be called. The state will be passed in as the first argument of this function. It does a shallow equal to prevent calls when the state didn't changed.
To narrow down the state, to prevent the function from being called when unrelated state changed, you can use the `map()` function, 
it works a bit like the first argument (`mapStateToProps`) in the `connect()` from `react-redux`:

```javascript

createMiddleware(
  doWhen(({isLoggedIn, url}, call) => {
    if (isLoggedIn && !!url) {
      call(connectToSocket, url) 
    }
  }).map(state => {
    return {
      isLoggedIn: state.login.isLoggedIn,
      url: state.socket.url
    }
  })
)

```

# Unit testing

With the `mock()` function you can easily test your setup:

```javascript

const connectToSocket = () => {}

const connectToSocketWhen = doWhen(
  ({isLoggedIn, url}, call) => {
    if (isLoggedIn && !!url) {
      call(connectToSocket, url)
    }
  }
)

it('should connect to socket', () => {

  const listener = jest.fn()
  const destruct = jest.fn()

  let tester = connectToSocketWhen.mock(listener, destruct) // <--- Here's the magic :)

  const url = "dfgh"
  tester({
    isLoggedIn: true,
    url
  })
  expect(listener).toBeCalledWith(connectToSocket, url, expect.anything())
	
})
```

# Shorthand functions

In some situations its a bit divious to write a function in doWhen, so some shorthand functions are profided. 
All shorthand function have the `map` and `mock` functionality and can be used in `createMiddleware` or without it by calling it directly (like in the first example).

## doWhenTrue

```javascript
doWhenTrue(connectToSocket)
```

Is comparable to:

```javascript
doWhen(state => {
  if (state) call(connectToSocket)
})
```

## doWhenChanged
doWhenChanged isn't really comparable to anything we can do with doWhen.
The example below will reconnect to the socket when the url has been changed:

```javascript
const connectToSocket = (newURL, oldURL) => {
  if (!newURL) return
  const socket = new WebSocket()
  socket.connect(newURL)
  return () => socket.close()
}
doWhenChanged(connectToSocket)
```

## doForAll
```javascript
doForAll(connectToSocket)
```

Is comparable to:

```javascript
doWhen(state => {
  Object.keys(state).forEach(key => {
    call(connectToSocket, state[key], key)
  })
})
```

## doForAllKeys
```javascript
doForAllKeys(connectToSocket)
```

Is comparable to:

```javascript
doWhen(state => {
  state.forEach(key => call(connectToSocket, key))
})
```

# Chaining API

Say the socket is disconnected and you fire up a timeout to reconnect. Whenever the conditions change the cancel function will be called. In this situation you don't want to call the socket.close(), but you do want to clear the timeout.

For this situation you can use the chaining API.

The last argument of the construct function contains the functions of the chaining API. This makes it possible to 'register' a new destruct function and opt-out of the current destruct function by using `next()`. If the current action isn’t finished yet you can use `branch()`.



