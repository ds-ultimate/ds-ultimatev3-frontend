import {useEffect, useState} from "react";
import axios from "axios";
import {coreProps, SORTING_DIRECTION} from "./DatatableBase";
import DatatableBodyRender from "./DatatableBodyRenderer";

interface paramsType<T> extends coreProps<T> {
  sort: Array<[number, SORTING_DIRECTION]>,
}

export default function DatatableCoreClientSide<T>({api, page, limit, itemCntCallback, sort, search, api_params,
                                                   ...bodyProps}: paramsType<T>) {
  //TODO this whole thing
  const [data, setData] = useState<T[]>()

  useEffect(() => {
    let mounted = true

    axios.get(api)
        .then((resp) => {
          if(mounted) {
            setData(resp.data)
          }
        })
        .catch((reason) => {
          //TODO show error to user
          console.log(reason)
        })
    return () => {
      mounted = false
    }
  }, [api])

  //TODO filter data
  return <DatatableBodyRender data={data} {...bodyProps}/>
}
