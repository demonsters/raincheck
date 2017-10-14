
# Raincheck

Do something when the conditions are right and cancel them if they're not.

Say you want to connect to a socket when you are logged in, and want to disconnect when not.
But you can only connect once the socket url is known.

If you know react, you know that it is particularly good in does tips of situations.
But a socket is not a `react` element, you could wrap in in one (start in componentDidMound, end in componentWillUnmount), but that's a bit akward.

Here comes raincheck to the rescue. Inspired by react & redux:

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

The `connectToSocket()` can be any function. This function can return an cancel function, which in this case closes the socket:

```javascript
const connectToSocket = (api, url) => {
  const socket = new WebSocket()
  socket.connect(url)
  return () => socket.close()
}
```

# Redux

`Raincheck` is particular great when used with Redux.
To connect to a store you can use `createMiddleware()`, like so:

```javascript

createMiddleware(
  doWhen(({isLoggedIn, url}, call) => {
    if (isLoggedIn && !!url) {
      call(connectToSocket, [url], url) 
    }
  })
)

```

The state will be passed in as the first argument. Everytime the state changed this will be called. 

To narrow down the state, you can use the `map()` function, it does a shallow equal and prevent calls if they did not change (like `mapStateToProps` in the `connect()` from `react-redux`):

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

TODO

## doWhenTrue

## doWhenChanged

## doForAll

## doForAllKeys


# Chaining API

TODO


