<p align="center"><img src="logo.png" width="244" width="400px"></p>

Small utility to run side effects, when the conditions are right, inspired by React/useEffect:

Example:

```js
let users = [{ id: 1, name: "John" }];
let shouldConnect = true;
let isConnected = false;

const render = raincheck(call => {
  if (shouldConnect) {
    call(() => {
      const ws = new WebSocket();
      ws.on("open", () => {
        isConnected = true;
        render();
      });

      return () => {
        ws.close();
      };
    }, "connect");
  }

  if (isConnected) {
    users.forEach(user => {
      call(() => {
        // Do something for user when connected

      }, [user], `user-${user.id}`);
    });
  }
});

render();

```

Equivelent of the same functionality with React:

```js

const User = ({ user }) => {
  useEffect(() => {
    // Do something for user when connected
  }, [user]);
};

const Connection = ({ users }) => {
  const [isConnected, setConnected] = useState();

  useEffect(() => {
    const ws = new WebSocket("url");
    ws.on("open", () => {
      setConnected(true);
    });

    return () => {
      ws.close();
    };
  });

  if (!isConnected) return null;

  return users.map((user) => <User user={user} key={`user-${user.id}`} />);
};

const Component = () => {
  const [shouldConnect, setShouldConnect] = useState(true);
  if (!shouldConnect) return null;
  return <Connection key="connect" users={[{ id: 1, name: "John" }]} />;
};

```

Or with internal state:

```js

import raincheck, { withState } from 'raincheck'

const render = withState(
  raincheck((call, { users, shouldConnect, isConnected }) => {
  
  if (shouldConnect) {
    call(() => {
      const ws = new WebSocket();
      ws.on("open", () => {
        render.setState({
          isConnected: true
        });
      });

      return () => {
        ws.close();
      };
    }, "connect");
  }

  if (isConnected) {
    users.forEach((user) => {
      call(() => {
        // Do something for user when connected

      }, [user], `user-${user.id}`);
    });
  }
}));

render.setState({
  users: [{ id: 1, name: "John" }],
  shouldConnect: true,
  isConnected: false,
});

```


Or with in React hook:

```js


const Component = ({ shouldConnect, users }) => { 
  const [isConnected, setConnected] = useState();

  useRaincheck(call => {
    if (shouldConnect) {
      call(() => {
        const ws = new WebSocket();
        ws.on("open", () => {
          setConnected(true);
        });

        return () => {
          ws.close();
        };
      }, "connect");
    }

    if (isConnected) {
      users.forEach(user => {
        call(() => {
          // Do something for user when connected
        }, [user], `user-${user.id}`);
      });
    }
  });
}

const Wrapper = () => {
  return <Component shouldConnect users={[{ id: 1, name: "John" }]} />;
};


```
