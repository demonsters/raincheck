
import { useRef, useMemo, useEffect } from 'react'
import forEach from '../forEach'

export default (state, fnc, keyExtractor) => {
  const ref = useRef()
  const check = ref.current || forEach(s => s, {
    do: fnc,
    keyExtractor
  })
  ref.current = check

  useEffect(() => {
    return () => {
      ref.current(null)
    }
  }, [])

  check(state)
}