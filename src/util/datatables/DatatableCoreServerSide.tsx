import {Key, useEffect, useState} from "react";
import axios from "axios";
import {SORTING_DIRECTION} from "./DatatableBase";

type paramsType<T> = {api: string, page: number, limit: number, cells: Array<(data: T) => string | JSX.Element>,
  keyGen: (data: T) => Key, itemCntCallback: (totalCount: number, filteredCount: number) => void,
  sort: Array<[string, SORTING_DIRECTION]>, search?: string}

export default function DatatableCoreServerSide<T>({api, page, limit, cells, keyGen, itemCntCallback, sort, search}: paramsType<T>) {
  const [data, setData] = useState<T[]>()

  useEffect(() => {
    let mounted = true
    const start = page * limit

    axios.get(api, {params: {start, length: limit, sort, search}})
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
  }, [api, page, limit, itemCntCallback, sort, search])

  return (
      <>
        {data?.map(d => {
          return (
              <tr key={keyGen(d)}>
                {cells.map((c, idx) => <td key={idx}>{c(d)}</td>)}
              </tr>
          )
        })}
      </>
  )
}
