//Based on https://stackoverflow.com/a/73648393
import {useCallback, useState} from "react";

function isCallback<T, P extends Array<any>>(maybeFunction: T | ((...args: P) => T)): maybeFunction is (...args: P) => T {
  return typeof maybeFunction === 'function'
}

type setState<S> = (value: S | ((oldState: S) => S)) => void

export default function usePersistentState<P, V>(
    key: string,
    initialValue: [P, V]
): [[P, V], setState<[P, V]>, setState<P>, setState<V>] {
  const [state, setInternalState] = useState<[P, V]>(() => {
    const value = localStorage.getItem(key)
    if (!value) return initialValue
    return [JSON.parse(value), initialValue[1]]
  })

  const setState = useCallback((value: [P, V] | ((oldState: [P, V]) => [P, V])) => {
    setInternalState(oldState => {
      let newVal = value
      if(isCallback(newVal)) {
        newVal = newVal(oldState)
      }
      localStorage.setItem(key, JSON.stringify(newVal[0]))
      return newVal
    })
  }, [key])

  const setPersistent = useCallback((value: P | ((oldState: P) => P)) => {
    setInternalState(([oldP, oldV]) => {
      let newVal = value
      if(isCallback(newVal)) {
        newVal = newVal(oldP)
      }
      localStorage.setItem(key, JSON.stringify(newVal))
      return [newVal, oldV]
    })
  }, [key])

  const setVolatile = useCallback((value: V | ((oldState: V) => V)) => {
    setInternalState(([oldP, oldV]) => {
      let newVal = value
      if(isCallback(newVal)) {
        newVal = newVal(oldV)
      }
      return [oldP, newVal]
    })
  }, [])

  return [state, setState, setPersistent, setVolatile]
}