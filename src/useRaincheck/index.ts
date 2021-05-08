import { useRef } from "react";
import { CheckerFunction } from "../doWhen";
import raincheck from "../doWhen"

const useRaincheck = (fnc: CheckerFunction<void>) => {

  const fncRef = useRef(fnc)
  if (fnc !== fncRef.current) {
    fncRef.current = fnc
  }

  const raincheckRef = useRef(raincheck((call) => {
    fncRef.current(call)
  }))

  raincheckRef.current()

}

export default useRaincheck
