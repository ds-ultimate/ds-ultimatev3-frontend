import {Key, useEffect, useState} from "react";
import axios from "axios";
import {SORTING_DIRECTION} from "./DatatableBase";

type paramsType<T> = {
  api: string,
  page: number,
  limit: number,
  cells: Array<(data: T) => string | JSX.Element>,
  keyGen: (data: T) => Key,
  rowClassGen?: (data: T) => string | undefined,
  itemCntCallback: (totalCount: number, filteredCount: number)=> void,
  sort: Array<[number, SORTING_DIRECTION]>,
  search?: string
}
export default function DatatableCoreClientSide<T>({api, page, limit, cells, keyGen, rowClassGen, itemCntCallback, sort, search}: paramsType<T>) {
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
