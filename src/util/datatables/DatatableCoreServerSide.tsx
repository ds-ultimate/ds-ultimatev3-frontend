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

import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {apiProps, coreProps, SORTING_DIRECTION} from "./DatatableBase";
import DatatableBodyRender from "./DatatableBodyRenderer";
import {LoadingScreenContext} from "../../pages/layout/LoadingScreen";
import {useErrorBoundary} from "react-error-boundary"

interface paramsType<T> extends coreProps<T>, apiProps {
  sort: Array<[string, SORTING_DIRECTION]>,
}

export default function DatatableCoreServerSide<T>({api, page, limit, itemCntCallback, sort, search, api_params,
                                                     exportEvent, setExportEvent, exportConverter, ...bodyProps}: paramsType<T>) {
  const [data, setData] = useState<T[]>()
  const setLoading = useContext(LoadingScreenContext)
  const { showBoundary } = useErrorBoundary()

  useEffect(() => {
    let mounted = true
    const start = page * limit
    setLoading(true, "ServerCore")

    axios.get(api, {params: {start, length: limit, sort, search, ...api_params}})
        .then((resp) => {
          setLoading(false, "ServerCore")
          if(mounted) {
            setData(resp.data.data)
            itemCntCallback(resp.data.count, resp.data.filtered)
          }
        })
        .catch((reason) => {
          setLoading(false, "ServerCore")
          showBoundary(reason)
        })
    return () => {
      mounted = false
    }
  }, [api, page, limit, itemCntCallback, sort, search, api_params, setLoading, showBoundary])

  //TODO support exporting data on the server side

  return <DatatableBodyRender data={data} {...bodyProps}/>
}
