// @flow

import doWhen from ".";

type State = {
  isLoggedIn: boolean;
  url: string;
  test?: number;
};

const getTester = (connectToSocket: (props: string) => any) =>
  doWhen((call, { isLoggedIn, url }: State) => {
    if (isLoggedIn && url) {
      call(connectToSocket, url);
    }
  });

describe("doWhen", () => {
  it("should call destructor once", () => {
    const connectToSocket = jest.fn();

    const tester = getTester(connectToSocket);

    const url = "dfgh";
    const state = {
      isLoggedIn: true,
      url,
    };

    tester(state);
    tester(state);
    expect(connectToSocket).toBeCalledWith(url);
    expect(connectToSocket).toHaveBeenCalledTimes(1);
  });


  it("should destruct function when not called anymore", () => {
    const destruct = jest.fn();
    const connectToSocket = () => destruct;

    const tester = getTester(connectToSocket);

    tester({
      isLoggedIn: true,
      url: "dfgh",
    });

    tester({
      isLoggedIn: false,
      url: "dfgh",
    });

    expect(destruct).toBeCalled();
  });

  it("should NOT destruct function when something unrelated changed", () => {
    const destruct = jest.fn();
    const connectToSocket = () => destruct;

    const tester = getTester(connectToSocket);

    tester({
      isLoggedIn: true,
      url: "dfgh1",
      test: 1,
    });

    tester({
      isLoggedIn: true,
      url: "dfgh1",
      test: 2,
    });

    expect(destruct).not.toBeCalled();
  });

  it("should work with arrays", () => {
    const start = jest.fn();
    const end = jest.fn();

    const func = (...args) => {
      start(...args);
      return end;
    };

    const tester = doWhen<Array<string>>((call, array) => {
      array.forEach((key) => call(func, key));
    });

    const obj1 = "object 1";
    const obj2 = "object 2";

    // Start obj1
    tester([obj1]);
    tester([obj1]);
    expect(start).toBeCalledWith(obj1);

    // Start obj2
    tester([obj1, obj2]);
    tester([obj1, obj2]);
    expect(start).toBeCalledWith(obj2);

    // End obj1
    tester([obj2]);
    tester([obj2]);
    expect(end).toBeCalled();

    // End obj2
    tester([obj1]);
    expect(start).toBeCalledWith(obj1);
    expect(end).toBeCalled();

    tester([]);
    expect(end).toBeCalled();

    expect(start).toHaveBeenCalledTimes(3);
    expect(end).toHaveBeenCalledTimes(3);
  });

  // This is unexpected behaviour
  xit("should pick the first argument (if is string) as key of no key is given", () => {
    const start = jest.fn();
    const end = jest.fn();

    const func = (...args) => {
      start(...args);
      return end;
    };

    const tester = doWhen((call, key) => {
      call(func, key);
    });

    tester("key1");
    expect(start).toHaveBeenCalledTimes(1);

    tester("key2");
    expect(start).toHaveBeenCalledTimes(2);
  });

  it("should take the args as key if not a array", () => {
    const start = jest.fn();
    const end = jest.fn();

    const func = (...args) => {
      start(...args);
      return end;
    };

    const tester = doWhen((call, key) => {
      call(func, key);
    });

    tester("key1");
    expect(start).toBeCalledWith("key1");
    expect(start).toHaveBeenCalledTimes(1);

    tester("key2");
    expect(start).toBeCalledWith("key2");
    expect(start).toHaveBeenCalledTimes(2);
  });

  xdescribe("mock()", () => {
    it("should be able to mock it easily", () => {
      const connectToSocket = () => {};

      const listener = jest.fn();
      const destruct = jest.fn();

      let tester = getTester(connectToSocket) //.mock(listener, destruct);

      const url = "dfgh";
      tester({
        isLoggedIn: true,
        url,
      });
      expect(listener).toBeCalledWith(connectToSocket, url, expect.anything());
      expect(destruct).not.toBeCalled();
      tester({
        isLoggedIn: false,
        url,
      });
      expect(destruct).toBeCalled();
    });

    // it('should be able to')

    it("should work when with if called befere mock", () => {
      const start = jest.fn();

      const listener = jest.fn();
      const destruct = jest.fn();

      const tester = doWhen(start)
        // .map((s) => s.value)
        // .mock(listener, destruct);

      const obj1 = "object 1";
      tester({ value: obj1 });
      expect(start).toBeCalledWith(expect.anything(), obj1, expect.anything());
    });

    it("should work when value is not an object", () => {
      const start = jest.fn();

      const listener = jest.fn();
      const destruct = jest.fn();

      const tester = doWhen(start) //.mock(listener, destruct);

      tester(true);
      expect(start).toBeCalled();
    });
  });

  it("should not overflow when called recursive", () => {
    let i = 0;

    const doFunc = () => {
      i++;
      if (i > 1) {
        throw new Error("Recursive error");
      }
      doCheck(true);
    };

    const doCheck = doWhen((call, value: boolean) => {
      if (value) {
        call(doFunc);
      }
    });

    doCheck(true);

    expect(i).toBe(1);
  });

  it("should work with variables from external", () => {
    const connectToSocket = jest.fn();
    let isLoggedIn = false;

    const check = doWhen((call) => {
      if (isLoggedIn) {
        call(connectToSocket);
      }
    });

    check();
    expect(connectToSocket).not.toBeCalled();

    isLoggedIn = true;

    check();
    expect(connectToSocket).toBeCalled();
  });


  it("should check if props are changed", () => {
    const construct = jest.fn();
    const destruct = jest.fn();
    let items = {
      "one": 1,
      "two": 2,
    };

    const check = doWhen((call) => {
        Object.keys(items).forEach(key => {
          call((...args) => {
            construct(...args)
            return () => {
              destruct()
            }
          }, [items[key]], `connect-${key}`);
        })
    });

    check();
    expect(construct).toHaveBeenCalledTimes(2);

    items = {
      "one": 2,
      "two": 1,
    };

    check();
    expect(destruct).toHaveBeenCalledTimes(2);
    expect(construct).toHaveBeenCalledTimes(4);
  });

  it("Should work with key", () => {
    const connectToSocket = jest.fn();
    const destruct = jest.fn();
    let list = ["a"];

    const check = doWhen((call) => {
      list.forEach(item => {
        call(() => {
          connectToSocket()
          return () => {
            destruct()
          }
        }, item)
      })
    });

    check();
    expect(destruct).not.toBeCalled()
    expect(connectToSocket).toHaveBeenCalledTimes(1);

    check();
    expect(connectToSocket).toHaveBeenCalledTimes(1);

    list = ["b"];

    check();
    expect(destruct).toHaveBeenCalledTimes(1)
    expect(connectToSocket).toHaveBeenCalledTimes(2);

  });


  describe('async', () => {


    it("Should call destruct when async is resolved", async () => {
      const connectToSocket = jest.fn();
      const destruct = jest.fn();
      let isLoggedIn = false;

      let resolve

      const check = doWhen((call) => {
        if (isLoggedIn) {
          call(() => new Promise(r => {
            resolve = r
            connectToSocket();
          }))
        }
      });

      check();
      expect(connectToSocket).not.toBeCalled();

      isLoggedIn = true;

      check();
      expect(connectToSocket).toBeCalled();

      await resolve(() => {
        destruct();
      })

      expect(destruct).not.toBeCalled();

      isLoggedIn = false;
      
      check();
      
      expect(destruct).toBeCalled();
    });
    
    it("Should call destruct when async is resolved later", async () => {
      const connectToSocket = jest.fn();
      const destruct = jest.fn();
      let isLoggedIn = false;

      let resolve

      const check = doWhen((call) => {
        if (isLoggedIn) {
          call(() => new Promise(r => {
            resolve = r
            connectToSocket();
          }))
        }
      });

      check();
      expect(connectToSocket).not.toBeCalled();

      isLoggedIn = true;

      check();
      expect(connectToSocket).toBeCalled();

      isLoggedIn = false;
      
      check();
      
      await resolve(() => {
        destruct();
      })
      expect(destruct).toBeCalled();
    });


  })

});
