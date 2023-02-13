import {Key, useEffect, useState} from "react";
import axios from "axios";
import {SORTING_DIRECTION} from "./DatatableBase";

type paramsType<T> = {api: string, page: number, limit: number, cells: Array<(data: T) => string | JSX.Element>,
  keyGen: (data: T) => Key, pageCnt: (pages: number) => void, sort?: number, sortDir?: SORTING_DIRECTION}
export default function DatatableCoreClientSide<T>({api, page, limit, cells, keyGen, pageCnt, sort, sortDir}: paramsType<T>) {
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

  return (
      <>
        {data?.map(d => {
          return (
              <tr key={keyGen(d)}>
                {cells.map(c => <td>{c(d)}</td>)}
              </tr>
          )
        })}
      </>
  )
}
