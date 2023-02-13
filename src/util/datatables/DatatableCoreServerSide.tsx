import {Key, useEffect, useState} from "react";
import axios from "axios";
import {SORTING_DIRECTION} from "./DatatableBase";

type paramsType<T> = {api: string, page: number, limit: number, cells: Array<(data: T) => string | JSX.Element>,
  keyGen: (data: T) => Key, pageCnt: (pages: number) => void, sort?: string, sortDir?: SORTING_DIRECTION}

export default function DatatableCoreServerSide<T>({api, page, limit, cells, keyGen, pageCnt, sort, sortDir}: paramsType<T>) {
  const [data, setData] = useState<T[]>()

  useEffect(() => {
    let mounted = true
    const start = page * limit

    axios.get(api, {params: {start, length: limit, sort: [[sort, sortDir]]}})
        .then((resp) => {
          if(mounted) {
            setData(resp.data.data)
            const pages = Math.ceil(resp.data.count / limit)
            pageCnt(pages)
          }
        })
        .catch((reason) => {
          //TODO show error to user
          console.log(reason)
        })
    return () => {
      mounted = false
    }
  }, [api, page, limit, pageCnt, sort, sortDir])

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
