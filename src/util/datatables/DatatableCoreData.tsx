/* 
Copyright (c) 2023 extremecrazycoder

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import {useEffect, useMemo} from "react";
import {coreProps, SORTING_DIRECTION} from "./DatatableBase";
import DatatableBodyRender from "./DatatableBodyRenderer";
import {handleExportEvent} from "./exporter/exporterBase";

interface paramsType<T> extends coreProps<T> {
  data: T[],
  sort: Array<[number, SORTING_DIRECTION]>,
  sortCB?: Array<((data1: T, data2: T) => number) | undefined>,
  searchCB?: ((data: T, search: string) => boolean),
}

export default function DatatableCoreData<T>({data, page, limit, itemCntCallback, sort, search, sortCB, searchCB,
                                               exportEvent, setExportEvent, exportConverter, ...bodyProps}: paramsType<T>) {
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
        for(let sPart of sort) {
          const sCallback = sortCB[sPart[0]]
          if(sCallback) {
            let res = sCallback(a, b)
            if(sPart[1] === SORTING_DIRECTION.DESC) {
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

  useEffect(() => {
    if(exportEvent !== undefined) {
      if(exportConverter === undefined) {
        throw Error("ExportConverter needs to be set")
      }
      const [header, converter] = exportConverter
      handleExportEvent(exportEvent, header, sorted?.map(value => converter(value)))
    }
    setExportEvent(undefined)
  }, [exportEvent, exportConverter, setExportEvent, sorted])

  const paged = useMemo(() => {
    if(sorted === undefined) return undefined
    const start = page * limit
    return sorted.slice(start, start + limit)
  }, [sorted, page, limit])
  return <DatatableBodyRender data={paged} {...bodyProps}/>
}
