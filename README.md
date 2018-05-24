<p align="center"><img src="logo.png" width="244" width="400px"></p>


Do something when the conditions are right and cancel them if they're not.

Say you want to connect to a socket when you’re logged in and want to disconnect when you’re not. This can only work once the socket url is known.

If you know react, you know that it’s pretty good in these types of situaties. The thing is, a socket isn’t a react element. You could wrap it as react element (start in componentDidMount, end in componentWillUnmount), but that’s a bit awkward. 

This is where raincheck comes to the rescue. Inspired by react & redux.

```javascript

import { when } from 'raincheck'

const recheck = when("ws://url1").do(connectToSocket) // Will open the connection

// ... later

recheck(false) // this will disconnect the socket, (can be false, null or undefined)

```

or when there is more than one


```javascript

import { forEach } from 'raincheck'

const recheck = forEach(['ws://url1', 'ws://url2']).do(connectToSocket) // Opens 2 socket connections

// ... later

recheck(['ws://url2']) // This will disconnect the first socket

```

The default value is optional:


```javascript

import { forEach } from 'raincheck'

const check = forEach().do(connectToSocket)

check(['ws://url1', 'ws://url2']) // Opens 2 connections

```

The `connectToSocket()` can be any function. This function can return a cancel function, which in this case will close the socket:

```javascript
const connectToSocket = (url) => {
  const socket = new WebSocket()
  socket.connect(url)
  return () => socket.close()
}
```

# Keys

To identify an object it uses keys, just like react. 
When you pass in an array in `forEach` it will use the value as key. But if the objects are not strings you should use the keyExtractor:

```javascript

forEach([{ url: '', id: 1 }])
  .do(item => connectToSocket(item.url), {
    keyExtractor: item => `${item.id}+${item.url}`,
  })

```

# React



```javascript

class Compontent extends React.Component {

  doConnectWhen = when(p => p.isLoggedIn && p.url).do(this.connect)

  componentDidMount() {
    this.doConnectWhen(this.props)
  }
  componentDidUpdate() {
    this.doConnectWhen(this.props)
  }

  connect(url) {
    //  <-- do connect
  }

  render () {
    // ..
  }
}

```


# Redux

`Raincheck` is particularly great when used with Redux.
To connect to a store you use `createMiddleware()`, like so:

```javascript

createMiddleware(
  when(state => state.login.isLoggedIn && state.socket.url)
    .do(connectToSocket)
)

```

As you can see you can pass in an function instead of an default value.
When you pass in a function it uses it to map the state to an value.
See here another example with `forEach`:

```javascript

createMiddleware(
  forEach((state: State) => state.sockets)
    .do(item => connectToSocket(item.url), {
      keyExtractor: item => `${item.id}+${item.url}`,
    })
)

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

`doForAllKeys` will be replaced by `forEach`, it doesn't have to be a string anymore the key is kan now be extract with `keyExtractor`

Both `doWhenTrue` & `doWhenChanged` will be replace by `when`.


# Chaining API

Say the socket is disconnected and you fire up a timeout to reconnect. Whenever the conditions change the cancel function will be called. In this situation you don't want to call the socket.close(), but you do want to clear the timeout.

For this situation you can use the chaining API.

The last argument of the construct function contains the functions of the chaining API. This makes it possible to 'register' a new destruct function and opt-out of the current destruct function by using `next()`. If the current action isn’t finished yet you can use `branch()`.

See an example of loading an image after every second,
it will cancel whatever process is active right now:

```javascript


const setTimer = ({next, branch}) => {
  let timer = setTimeout(() => next(getImage), 1000)
  return () => clearTimeout(timer)
}

const loadImage = (result: string) => ({finish}) => {

  // Load image for dimensions
  let img = new Image()
  img.onload = () => {
    finish()
    // next(setTimer)
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

const getImage = (url, {next}) => {

  if (!body || !url) return

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

createMiddleware(
  when(state => state.image.isActive && state.image.url)
    .do(getImage)
)

```
