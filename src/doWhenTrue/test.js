import doWhenTrue from ".";

describe("doWhenTrue()", () => {

  it("should work with true & false", () => {

    const start = jest.fn();
    const end = jest.fn();

    const tester = doWhenTrue((...args) => {
      start(...args);
      return () => end(...args);
    });

    tester(true);
    expect(start).toBeCalled();
    tester(true);

    tester(false);
    expect(start).toBeCalled();
    tester(false);

    expect(start).toHaveBeenCalledTimes(1);
    expect(start).toHaveBeenCalledTimes(1);
  });

  it("should cancel next", () => {
    const firstStart = jest.fn();
    const firstEnd = jest.fn();

    const secondStart = jest.fn();
    const secondEnd = jest.fn();

    let nextHandler;

    const first = next => {
      firstStart();
      nextHandler = () => next(second());
      return firstEnd;
    };

    const second = () => {
      secondStart();
      return secondEnd;
    };

    const tester = doWhenTrue(first);

    tester(true);
    expect(firstStart).toBeCalled();

    nextHandler();

    expect(secondStart).toBeCalled();

    tester(false);

    expect(secondEnd).toHaveBeenCalledTimes(1);
    expect(firstEnd).not.toBeCalled();
  });

  describe("with()", () => {

    it("should call when true", () => {
      const start = jest.fn();
      const tester = doWhenTrue(start).with(s => s.value);

      tester({ value: true });
      expect(start).toBeCalled();
    });

    it("should NOT call when false", () => {
      const start = jest.fn();
      const tester = doWhenTrue(start).with(s => s.value);

      tester({ value: false });
      expect(start).not.toBeCalled();
    });
  });
});
