import {useContext, useEffect, useState} from "react";
import axios from "axios";
import {coreProps, SORTING_DIRECTION} from "./DatatableBase";
import DatatableBodyRender from "./DatatableBodyRenderer";
import {LoadingScreenContext} from "../../pages/layout/LoadingScreen";
import {useErrorBoundary} from "react-error-boundary"

interface paramsType<T> extends coreProps<T> {
  sort: Array<[string, SORTING_DIRECTION]>,
}

export default function DatatableCoreServerSide<T>({api, page, limit, itemCntCallback, sort, search, api_params,
                                                   ...bodyProps}: paramsType<T>) {
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

  return <DatatableBodyRender data={data} {...bodyProps}/>
}
