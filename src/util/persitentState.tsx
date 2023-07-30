//Based on https://stackoverflow.com/a/73648393
import {useCallback, useState} from "react";

function isCallback<T, P extends Array<any>>(maybeFunction: T | ((...args: P) => T)): maybeFunction is (...args: P) => T {
  return typeof maybeFunction === 'function'
}

type setState<S> = (value: S | ((oldState: S) => S)) => void

export default function usePersistentState<P>(
    key: string,
    initialValue: P | (() => P)
): [P, setState<P>] {
  const [state, setInternalState] = useState<P>(() => {
    const value = localStorage.getItem(key)
    if (!value) {
      const initVal = isCallback(initialValue)?initialValue():initialValue
      localStorage.setItem(key, JSON.stringify(initVal))
      return initVal
    }
    return (JSON.parse(value)) as P
  })

  const setPersistent = useCallback((value: P | ((oldState: P) => P)) => {
    setInternalState(oldP => {
      let newVal = value
      if(isCallback(newVal)) {
        newVal = newVal(oldP)
      }
      localStorage.setItem(key, JSON.stringify(newVal))
      return newVal
    })
  }, [key])

  return [state, setPersistent]
}