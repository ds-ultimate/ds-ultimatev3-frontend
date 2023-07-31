import {useContext, useEffect, useMemo, useState} from "react";
import axios from "axios";
import {coreProps, SORTING_DIRECTION} from "./DatatableBase";
import DatatableBodyRender from "./DatatableBodyRenderer";
import {LoadingScreenContext} from "../../pages/layout/LoadingScreen";
import {useErrorBoundary} from "react-error-boundary"

interface paramsType<T> extends coreProps<T> {
  sort: Array<[number, SORTING_DIRECTION]>,
  sortCB?: Array<((data1: T, data2: T) => number) | undefined>,
  searchCB?: ((data: T, search: string) => boolean),
}

export default function DatatableCoreClientSide<T>({api, page, limit, itemCntCallback, sort, search, api_params,
                                                     sortCB, searchCB, ...bodyProps}: paramsType<T>) {
  const [data, setData] = useState<T[]>()
  const setLoading = useContext(LoadingScreenContext)
  const { showBoundary } = useErrorBoundary()

  useEffect(() => {
    let mounted = true
    setLoading(true, "ClientCore")

    axios.get(api, {params: api_params})
        .then((resp) => {
          setLoading(false, "ClientCore")
          if(mounted) {
            setData(resp.data.data)
            itemCntCallback(resp.data.data.length, resp.data.data.length)
          }
        })
        .catch((reason) => {
          setLoading(false, "ClientCore")
          showBoundary(reason)
        })
    return () => {
      mounted = false
    }
  }, [api, api_params, itemCntCallback, setLoading, showBoundary])

  const filtered = useMemo(() => {
    if(data === undefined) return undefined
    if(searchCB === undefined || search === undefined) {
      setTimeout(() => itemCntCallback(data.length, data.length))
      return data
    }
    const filtered = data.filter(value => searchCB(value, search))
    setTimeout(() => itemCntCallback(data.length, filtered.length))
    return filtered
  }, [data, searchCB, search, itemCntCallback])

  const sorted = useMemo(() => {
    if(filtered === undefined) return undefined
    const sorted = filtered.slice()
    if(sort.length > 0 && sortCB) {
      sorted.sort((a, b) => {
        for(let i = 0; i < sort.length; i++) {
          const sCallback = sortCB[sort[i][0]]
          if(sCallback) {
            let res = sCallback(a, b)
            if(sort[i][1] === SORTING_DIRECTION.DESC) {
              res *= -1
            }
            if(res !== 0) {
              return res
            }
          }
        }
        return 0
      })
    }
    return sorted
  }, [filtered, sort, sortCB])

  const paged = useMemo(() => {
    if(sorted === undefined) return undefined
    const start = page * limit
    return sorted.slice(start, start + limit)
  }, [sorted, page, limit])
  return <DatatableBodyRender data={paged} {...bodyProps}/>
}
