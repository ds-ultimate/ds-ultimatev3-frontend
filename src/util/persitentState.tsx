/* 
Copyright (c) 2023 extremecrazycoder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

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
