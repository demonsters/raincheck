<p align="center"><img src="logo.png" width="244" width="400px"></p>


Do something when the conditions are right and cancel them if they're not.

- Simple: No complex api
- No wrapper's needed around other API's
- Focused on doing one thing
- Small in size
- Works for multiple purposes


Say you want to connect to a socket when you’re logged in and want to disconnect when you’re not. 
This can only work once the socket url is known.
Also it must be disconnected when the url is changed and connect to the new one. 

Here's how you can do this with raincheck:

```javascript

import { when } from 'raincheck'

const doConnectWhen = when().do((url) => {
  const socket = new WebSocket()
  socket.connect(url)
  return () => socket.close()
}) 

doConnectWhen("ws://url1") // Will open the connection

doConnectWhen("ws://url2") // Will close the first connection and open an new one

doConnectWhen(false) // Will close the second connection (can be false, null or undefined)

```

Say you want to keep multiple connections open:


```javascript

import { forEach } from 'raincheck'

const doConnectForEach = forEach().do((url) => {
  const socket = new WebSocket()
  socket.connect(url)
  return () => socket.close()
}) 

doConnectForEach(['ws://url1', 'ws://url2']) // Opens 2 socket connections

doConnectForEach(['ws://url2']) // Will close the first socket

doConnectForEach([]) // Will close the second socket

```


The function passed into `do` starts a process and returns a cancel function.


# Syntax

Raincheck consists of 3 function:
- `when`: For single objects
- `forEach`: For an array of objects
- `forEachEntry`: For an key-value based objects

Each function accepts a map function a settings object or both:

```javascript

// Map function
when(s => s.value)
  .do(handleFnc)

// Settings
when({
  do: handleFnc
})

// Map function & settings
when(s => s.value, {
  do: handleFnc
})


```


# Changes

To identify that an object has been changed, raincheck uses keys, just like react. 

## when

`when` will always cancel & call do when a object is changed, but when you add `keyExtractor` it will call `changed` when the key is the same as the one before.

```javascript

const check = when({
  keyExtractor: item => `${item.id}+${item.url}`,
  do: (item) => connectToSocket(item.url),
  changed: (newValue, oldValue, key) => {
    // When an object with the same key has changed
  }
})

check({ url: 'url1', name: '1', id: '1' }) // Will only call do
check({ url: 'url1', name: '2', id: '1' }) // Will only call changed

```

## forEach
When you pass in an array to `forEach` it will use the value as key. But if the objects are not strings you may use the `keyExtractor`:

```javascript

const check = forEach({
  keyExtractor: item => `${item.id}+${item.url}`,
  do: (item) => connectToSocket(item.url),
  changed: (newValue, oldValue, key) => {
    // When an object with the same key has changed
  }
})

check([{ url: 'url1', name: '1', id: '1' }]) // Will only call do
check([{ url: 'url1', name: '2', id: '1' }]) // Will only call changed


```

## forEachEntry

With `forEachEntry` the key of the object is used, so no keyExtractor is needed:

```javascript

const check = forEachEntry({
  do: (item) => connectToSocket(item.url),
  changed: (newValue, oldValue, key) => {
    // When an object with the same key has changed
  }
})

check({'1': { url: '', name: '1' }}) // Will only call do
check({'1': { url: '', name: '2' }}) // Will only call changed

```

# Examples

## React

```javascript

class Compontent extends React.Component {

  doConnectWhen = when(props => props.isLoggedIn && props.url, {
    do: (url) => {
      //  do connect
    }
  })

  componentDidMount() {
    this.doConnectWhen(this.props)
  }
  componentDidUpdate() {
    this.doConnectWhen(this.props)
  }
  componentDidUnmount() {
    this.doConnectWhen(null)
  }

  render () {
    // ..
  }
}

```

## Redux

`Raincheck` is particularly great when used with Redux.
To connect to a store you use `createMiddleware()`, like so:

```javascript

export default createMiddleware(
  when(state => state.login.isLoggedIn && state.socket.url)
    .do(connectToSocket)
)

```

Or just call it yourself inside a middleware:

```javascript

export default (store) => {
  let check = forEach((state) => state.sockets, {
    do: item => connectToSocket(item.url),
    keyExtractor: item => `${item.id}+${item.url}`,
  })

  (next) => (action) => {
    let ret = next(action)
    check(store.getState())
    return ret
  }
}

```

## Reselect

```javascript

const selector = createSelector(
  s => s.projects, 
  s => s.user, 
  (projects, user) => (projects && {projects, user}), 
)

when(selector).do(({project, login}) => {

  // Called when project is truthy & project & user is changed
  
})

```

## PouchDB

Here an example to sync an array to PouchDb:

```javascript

const check = forEach({
  do: items => {
    db.put(item)
    return () => db.delete(item)
  },
  keyExtractor: item => item._id,
  changed: (newValue, oldValue) => {
    db.put(newValue)
  }
})

```


# Unit testing

With the `mock()` function you can easily test your setup:

```javascript

const connectToSocket = () => {}

const doConnectToSocketWhen = when(
  ({isLoggedIn, url}) => isLoggedIn && !!url
).do(connectToSocket)

it('should connect to socket', () => {

  const listener = jest.fn()
  const destruct = jest.fn()

  let tester = doConnectToSocketWhen.mock(listener, destruct) // <--- Here's the magic :)

  const url = "dfgh"
  tester({
    isLoggedIn: true,
    url
  })
  expect(listener).toBeCalledWith(connectToSocket, url, expect.anything())
	
})
```


# Deprecated

`doForAll`, `doForAllKeys`, `doWhenTrue` & `doWhenChanged` are deprecated and will be removed in 1.0. 

## Replacements

`doForAll` will be replaced by `forEachEntity`

`doForAllKeys` will be replaced by `forEach`, it doesn't have to be a string anymore the key is can now be extract with `keyExtractor`

Both `doWhenTrue` & `doWhenChanged` will be replace by `when`.


# Chaining API

Say the socket is disconnected and you fire up a timeout to reconnect. Whenever the conditions change the cancel function will be called. In this situation you don't want to call the socket.close(), but you do want to clear the timeout.

For this situation you can use the chaining API.

The second argument of the construct function contains the functions of the chaining API. This makes it possible to 'register' a new destruct function and opt-out of the current destruct function by using `next()`. If the current action isn’t finished yet you can use `branch()`.

See an example of loading an image after every second,
it will cancel whatever process is active right now:

```javascript


const getImage = (url, next, store, action) => {

  const setTimer = ({next}) => {
    let timer = setTimeout(() => next(sendRequest), 1000)
    return () => clearTimeout(timer)
  }

  const loadImage = (result: string) => ({finish}) => {

    // Load image for dimensions
    let img = new Image()
    img.onload = () => {
      finish()
    }
    img.src = result

    return () => img.src = ""
  }

  const readFile = (response) => ({next}) => {

    let reader = new FileReader()
    reader.onload = (e) => {
      next(loadImage(reader.result))
    }
    reader.readAsDataURL(response)

    return () => reader.abort()
  }

  const sendRequest = ({next, branch}) => {

    let xhrreq = new XMLHttpRequest()
    xhrreq.open('POST', url)
    xhrreq.responseType = "blob";

    xhrreq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhrreq.onload = (ev) => {
      if (xhrreq.status === 200) {
        // Already start a timer
        branch(setTimer)

        // Start next 
        next(readFile(xhrreq.response))
      }
    }
    xhrreq.send(body)

    return () => xhrreq.abort()
  }

  return sendRequest(next)
}

createMiddleware(
  when(state => state.image.isActive && state.image.url)
    .do(getImage)
)

```

# TODO v1.0 (backwards incompatible)
- Change `map` to apply to all entries
- Remove `doForAll`, `doForAllKeys`, `doWhenTrue` & `doWhenChanged`
- Choose functions for chaining API:
  - `branch` or `fork`
  - `complete`, `finish` or `resolve`
  - `chain` or `next`
- Change `when` to send all parameters to `do` instead of just the value of the selector?
