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

import {createContext, Fragment, ReactNode, useCallback, useContext, useEffect, useState} from "react";
import {Toast, ToastContainer} from "react-bootstrap";


const ToastCreateContext = createContext<(header: ReactNode, body: ReactNode) => void>(() => {})

const TOAST_DELAY = 5 * 1000

export default function ToastHandler({children}: {children: ReactNode | ReactNode[]}) {
  const [toastList, updateToastList] = useState<Array<[number, ReactNode]>>([])

  const removeToast = useCallback((id: number) => {
    updateToastList(old => old.filter(([tId, _]) => tId !== id))
  }, [updateToastList])

  const createToast = useCallback((header: ReactNode, body: ReactNode) => {
    const id = (new Date()).getTime()
    const toast = (
        <Toast onClose={() => removeToast(id)}>
          <Toast.Header><strong className={"me-auto"}>{header}</strong></Toast.Header>
          <Toast.Body>{body}</Toast.Body>
        </Toast>
    )
    updateToastList(old => [...old, [id, toast]])
  }, [updateToastList, removeToast])

  const clearToasts = useCallback(() => {
    const min = (new Date()).getTime() - TOAST_DELAY
    updateToastList(old => old.filter(([tId, _]) => tId > min))
  }, [updateToastList])

  useEffect(() => {
    if(toastList.length < 1) return
    const minTime = Math.min(...(toastList.map(([time, _]) => time)))
    const nextRemoval = Math.max(minTime + TOAST_DELAY - (new Date()).getTime(), 100)
    const timeout = setTimeout(clearToasts, nextRemoval)

    return () => clearTimeout(timeout)
  }, [toastList, clearToasts]);

  return (
      <>
        <ToastCreateContext.Provider value={createToast}>
          {children}
          <ToastContainer position={"top-end"} className={"me-3 mt-4"} style={{position: "fixed"}}>
            {toastList.map(([id, data]) => <Fragment key={id}>{data}</Fragment>)}
          </ToastContainer>
        </ToastCreateContext.Provider>
      </>
  )
}

export function useCreateToast() {
  return useContext(ToastCreateContext)
}
