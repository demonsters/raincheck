
export type DestructFunction = () => void;

export type ConstructReturnType =
  | void
  | DestructFunction
  | Promise<void | DestructFunction>;

export type ConstructFunction<P> = (props: P) => ConstructReturnType;

export type CallFunction = <P>(
  funct: ConstructFunction<P>,
  props?: P,
  key?: string
) => void;

export type CheckerFunction<S> = (call: CallFunction, props: S) => void;

const isPromise = (
  value: ConstructReturnType
): value is Promise<DestructFunction> => {
  return Boolean(value && "then" in value && typeof value.then === "function");
};

function shallowDiffers(a: any, b: any) {
  if (a === b) return false;
  if (!a || !b) return true;
  if (typeof a !== "object" || typeof b !== "object") return true;
  for (const i in a) if (!(i in b)) return true;
  for (const i in b) if (a[i] !== b[i]) return true;
  return false;
}

const destructWrapper = (destructFunc?: ConstructReturnType) => {
  if (!destructFunc) {
    return null;
  }

  let isDestructed = false;

  let destruct: DestructFunction;

  if (isPromise(destructFunc)) {
    destructFunc.then((fnc) => {
      if (!fnc) return;
      if (isDestructed) {
        fnc();
      } else {
        destruct = fnc;
      }
    });
  } else if (typeof destructFunc === "function") {
    destruct = destructFunc;
  }

  return () => {
    if (isDestructed) return;
    isDestructed = true;
    if (destruct) {
      destruct();
    }
  };
};

export default function doWhen<S>(
  checkFunc: CheckerFunction<S>
): (state?: S) => void {

  const destructFuncs: { [key: string]: () => void } = {};
  const cachedProps: { [key: string]: any } = {};
  let destructKeys: Array<string>;

  const callFunc: CallFunction = (func, props, key) => {
    if (key === undefined) {
      if (typeof props === "string") {
        key = props;
      } else {
        key = "default";
      }
    }

    const index = destructKeys.indexOf(key);
    if (index > -1) destructKeys.splice(index, 1);

    if (
      destructFuncs[key] === undefined ||
      (cachedProps[key] !== undefined &&
        shallowDiffers(cachedProps[key], props))
    ) {
      if (destructFuncs[key]) {
        destructFuncs[key]();
        destructFuncs[key] = undefined;
      }

      cachedProps[key] = props;
      destructFuncs[key] = destructWrapper(func(props));
    }
  };

  let oldState = {};

  return (state?: S) => {
    if (!state || shallowDiffers(oldState, state)) {
      destructKeys = Object.keys(destructFuncs);

      oldState = state;

      checkFunc(callFunc, state);

      for (let i = 0; i < destructKeys.length; i++) {
        const key = destructKeys[i];
        if (destructFuncs[key]) {
          destructFuncs[key]();
          destructFuncs[key] = undefined;
        }
      }
    }
  };
}
