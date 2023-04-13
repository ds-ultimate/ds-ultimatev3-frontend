import {useEffect, useState} from "react";
import axios from "axios";
import {coreProps, SORTING_DIRECTION} from "./DatatableBase";
import DatatableBodyRender from "./DatatableBodyRenderer";

interface paramsType<T> extends coreProps<T> {
  sort: Array<[string, SORTING_DIRECTION]>,
}

export default function DatatableCoreServerSide<T>({api, page, limit, itemCntCallback, sort, search, api_params,
                                                   ...bodyProps}: paramsType<T>) {
  const [data, setData] = useState<T[]>()

  useEffect(() => {
    let mounted = true
    const start = page * limit

    axios.get(api, {params: {start, length: limit, sort, search, ...api_params}})
        .then((resp) => {
          if(mounted) {
            setData(resp.data.data)
            itemCntCallback(resp.data.count, resp.data.filtered)
          }
        })
        .catch((reason) => {
          //TODO show error to user
          console.log(reason)
        })
    return () => {
      mounted = false
    }
  }, [api, page, limit, itemCntCallback, sort, search, api_params])

  return <DatatableBodyRender data={data} {...bodyProps}/>
}
