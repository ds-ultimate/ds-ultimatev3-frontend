import {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {coreProps, SORTING_DIRECTION} from "./DatatableBase";
import DatatableBodyRender from "./DatatableBodyRenderer";

interface paramsType<T> extends coreProps<T> {
  sort: Array<[number, SORTING_DIRECTION]>,
  searchCB?: ((data: T, search: string) => boolean),
}

export default function DatatableCoreClientSide<T>({api, page, limit, itemCntCallback, sort, search, api_params,
                                                     searchCB, ...bodyProps}: paramsType<T>) {
  const [data, setData] = useState<T[]>()

  useEffect(() => {
    let mounted = true

    axios.get(api, {params: api_params})
        .then((resp) => {
          if(mounted) {
            setData(resp.data.data)
            itemCntCallback(resp.data.data.length, resp.data.data.length)
          }
        })
        .catch((reason) => {
          //TODO show error to user
          console.log(reason)
        })
    return () => {
      mounted = false
    }
  }, [api, api_params, itemCntCallback])

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
    //TODO sorting -> misses a good idea how to get from generics to actual comparable type. Maybe use comp fkt defined in header?
    return filtered.slice()
  }, [filtered])

  const paged = useMemo(() => {
    if(sorted === undefined) return undefined
    const start = page * limit
    return sorted.slice(start, start + limit)
  }, [sorted, page, limit])
  return <DatatableBodyRender data={paged} {...bodyProps}/>
}
