import {useMemo} from "react";
import {coreProps, SORTING_DIRECTION} from "./DatatableBase";
import DatatableBodyRender from "./DatatableBodyRenderer";

interface paramsType<T> extends coreProps<T> {
  data: T[],
  sort: Array<[number, SORTING_DIRECTION]>,
  sortCB?: Array<((data1: T, data2: T) => number) | undefined>,
  searchCB?: ((data: T, search: string) => boolean),
}

export default function DatatableCoreData<T>({data, page, limit, itemCntCallback, sort, search,
                                               sortCB, searchCB, ...bodyProps}: paramsType<T>) {
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
