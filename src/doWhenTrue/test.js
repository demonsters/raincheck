// @flow

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

    if (nextHandler) {
      nextHandler();
    }

    expect(secondStart).toBeCalled();

    tester(false);

    expect(secondEnd).toHaveBeenCalledTimes(1);
    expect(firstEnd).not.toBeCalled();
  });

  it('should reset old state for new map? bit of a rare situation I guess', () => {

    const started = jest.fn();
    const ended = jest.fn();
    const tester = doWhenTrue(() => {
      started()
      return ended
    });
    tester(true)

    const tester2 = tester.map(s => s.value)
    tester2({value: true})
    expect(started).toHaveBeenCalledTimes(2)
    tester(false)
    expect(ended).toHaveBeenCalledTimes(1)

    tester2({value: false})
    expect(ended).toHaveBeenCalledTimes(2)

  })

  describe("map()", () => {

    it("should call when true", () => {
      const start = jest.fn();
      type State = {
        value: boolean
      }
      const tester = doWhenTrue(start).map((s: State) => s.value);

      tester({ value: true });
      expect(start).toBeCalled();
    });

    it("should call with multiple maps", () => {
      const start = jest.fn();
      type State1 = {
        value: State2
      }
      type State2 = {
        value1: boolean
      }
      const tester = doWhenTrue(start)
        .map((s: State2) => s.value1)
        .map((s: State1) => s.value)

      tester({ value: { value1: true } });
      expect(start).toBeCalled();
    });


    it("should NOT call with multiple maps value = false", () => {
      const start = jest.fn();
      type State1 = {
        value: State2
      }
      type State2 = {
        value1: boolean
      }
      const tester = doWhenTrue(start)
        .map((s: State2) => s.value1)
        .map((s: State1) => s.value)

      tester({ value: { value1: false } });
      expect(start).not.toBeCalled();
    });


    it("should NOT call when false", () => {
      const start = jest.fn();
      type State = {
        value: boolean
      }
      const tester = doWhenTrue(start).map((s: State) => s.value);

      tester({ value: false });
      expect(start).not.toBeCalled();
    });
  });


  describe("mock()", () => {

    it('should be testable', () => {

      const spy = jest.fn()
      const changed = () => {}
      const tester = doWhenTrue(changed).mock(spy)

      tester(true)
      expect(spy).toBeCalled()

    })
  })


});
