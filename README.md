# Raincheck

Do something when the conditions are right and cancel them if they're not.

Say you want to connect to a socket when you’re logged in and want to disconnect when you’re not. This can only work once the socket url is known.

If you know react, you know that it’s pretty good in these types of situaties. The thing is, a socket isn’t a react element. You could wrap it as react element (start in componentDidMount, end in componentWillUnmount), but that’s a bit awkward. 

This is where raincheck comes to the rescue. Inspired by react & redux.


```javascript

import { doWhen } from 'raincheck'

const raincheck = doWhen({isLoggedIn, url}, call) => {
  if (isLoggedIn && !!url) {
    call(connectToSocket, [url], url) 
  }
})

```

This will connect to the socket when the following is called:

```javascript
raincheck({
  isLoggedIn: true,
  url: 'ws://socketurl'
})
```

And disconnect when:

```javascript
raincheck({
  isLoggedIn: false
})
```

`Raincheck` works with key's the same way react does. It's the third argument of the `call` function.

The `connectToSocket()` can be any function. This function can return a cancel function, which in this case will close the socket:

```javascript
const connectToSocket = (api, url) => {
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
      call(connectToSocket, [url], url) 
    }
  })
)

```

Each time the state changes the function passed into doWhen will be called. The state will be passed in as the first argument of this function.

To narrow down the state, you can use the `map()` function. It does a shallow equal and prevent calls when they don’t change (like `mapStateToProps` in the `connect()` from `react-redux`):

```javascript

createMiddleware(
  doWhen(({isLoggedIn, url}, call) => {
    if (isLoggedIn && !!url) {
      call(connectToSocket, [url], url) 
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

// Imported from other file

const connectToSocketWhen = doWhen(
  ({isLoggedIn, url}, call) => {
    if (isLoggedIn && !!url) {
      call(connectToSocket, [url], url)
    }
  }
)

it('should connect to socket', () => {

  const connectToSocket = () => {}

  const listener = jest.fn()
  const destruct = jest.fn()

  let tester = connectToSocketWhen.mock(listener, destruct) // <--- Here's the magic :)

  const url = "dfgh"
  tester({
    isLoggedIn: true,
    url
  })
  expect(listener).toBeCalledWith(connectToSocket, [url], expect.anything())
	
})
```

# Shorthand functions

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
doWhenChanged isn't really comparable to anything we can do with doWhen

## doForAll
```javascript
doForAll(connectToSocket)
```

Is comparable to:

```javascript
doWhen(state => {
  Object.keys(state).forEach(key => {
    call(connectToSocket, [state[key]], key)
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
  state.forEach(key => call(connectToSocket, [key], key))
})
```

# Chaining API

Say the socket is disconnected and you fire up a timeout to reconnect. Whenever the conditions change the cancel function will be called. In this situation you don't want to call the socket.close(), but you do want to clear the timeout.

For this situation you can use the chaining API.

The last argument of the construct function contains the functions of the chaining API. This makes it possible to 'register' a new destruct function and opt-out of the current destruct function by using `next()`. If the current action isn’t finished yet you can use `branch()`.



