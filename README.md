
# redux-do-when

`redux-do-when` is a condition based cancelable side effect library for redux.
It's like React for non-view components.
The components are functions that construct the 'side effect' and returns de destructor. The construct and destruct functions are called depanding on the condition given. 

# Example

Starting a socket when `isLoggedIn` is `true`, and close it when its `false`.

```javascript

const connectToSocket = (url, {subscribe}, store) => { // createMiddleware add store and action as arguments
	// The action to send
	const socket = new WebSocket()
	socket.onMessage = (m) => store.dispatch(received(m.data))
	socket.connect(url)

	subscribe('SEND', (action) => socket.send(action.payload))

	return socket.close
}

createMiddleware(
	connect(
		s => s.isLoggedIn, // The condition
		doWhen(
			connectToSocket
		)
	)
)


generate(

	state => ({
		isLoggedIn: state.isLoggedIn, 
		socketURL: state.socketURL
	}),

	{connectToSocket},

	({isLoggedIn, socketURL}, {connectToSocket}) => {
		if (isLoggedIn && socketURL) {
			connectToSocket({
				key: socketURL,
				props: [socketURL]
			}) // Uses first argument is the key
		}
	}
)


import generate from ''

const tester = generate(

	state => ({
		isLoggedIn: state.isLoggedIn, 
		url: state.url
	}),

	({isLoggedIn, url}, call) => {
		if (isLoggedIn && url) {
			call(connectToSocket, [url], url) 
			// if key is not set it takes the first argument
		}
	}
)


const url = ""
const state = {
	isLoggedIn: true,
	url
}

const listener = jest.fn()
tester(state, listener)
expect(listener).toBeCalledWith(connectToSocket, [url], jest.some())


// Return object
generate(

	state => ({
		isLoggedIn: state.isLoggedIn, 
		sockets: state.sockets
	}),

	{connectToSocket},

	({isLoggedIn, sockets}, {connectToSocket}) => {
		if (isLoggedIn && sockets) {
			return sockets.reduce(
				(object, url) => {...object, [url]: connectToSocket(url)}, {}
			)
		}
	}
)



generate(

	state => ({
		isLoggedIn: state.isLoggedIn, 
		sockets: state.sockets
	}),

	{connectToSocket},

	({isLoggedIn, sockets}, {connectToSocket}) => {
		if (isLoggedIn && sockets) {

			//
			sockets.forEach(url => call(connectToSocket, [url], url))

			sockets.forEach(url => connectToSocket([url]))

			sockets.forEach(url => connectToSocket([url], url))
		}
	}
)


```


# Why no Promises or generators

Promises are not cancalable.
Generators need a very large polyfill for ie 11.


## doWhen
The condition function returns an boolean.
`doWhen` is calling the constructor when condition is changed to `true` and descructor when changed to `false`.
The construct function gets the `next` function as argument.

## doForAll
The condition function returns an object.
`doForAll` calls the constructor for every key in the object with the value and destruct when the key is not pressent in the object.
The construct function gets the object as the first argument, after that the `next` function.

## doForAllKeys
The condition function returns is an array of strings.
`doForAllKeys` calls the constructor for every key in the array.
The construct function gets the key as the first argument, after that the `next` function.

## doWhenChanged
The condition function returns anything.
`doWhenChanged` calls the constructor whenever the value is not undefined and other than the old value and the destruct whenever the value changed to another value before the constructor is called.
The construct function get the new value as first argument, the old value as second argument, after that the `next` function.


# Chaining
You can change the destruct, like when you want to chain another action, by calling the `next` function, given to the constructor.

## Branch
You can also branch a chain. This will add a destruct function instead of replace it so the two side effects can be active at the same time.



```

```
