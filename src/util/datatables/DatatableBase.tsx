import {useTranslation} from "react-i18next";
import React, {createContext, Key, useCallback, useState} from "react";
import DatatableCoreServerSide from "./DatatableCoreServerSide";
import DatatableCoreClientSide from "./DatatableCoreClientSide";

type paramsType<T> = {api: string, header: JSX.Element, serverSide?: boolean,
  cells: Array<(data: T) => string | JSX.Element>, keyGen: (data: T) => Key}

type sort_type = string | number
type stateType = {page: number, pageCnt: number, limit: number, sort?: sort_type, sortDirection?: SORTING_DIRECTION}

const DatatableContext = createContext<{setSortBy?: (key: sort_type, dir: SORTING_DIRECTION) => void,
  curSortBy?: sort_type, curSortDir?: SORTING_DIRECTION}>({})

enum SORTING_DIRECTION {
  ASC,
  DESC,
}

export default function DatatableBase<T>({api, header, serverSide, cells, keyGen}: paramsType<T>) {
  // TODO save / read setting from localStorage
  const [{page, pageCnt, limit, sort, sortDirection}, setConfig] =
      useState<stateType>({page: 0, pageCnt: 1, limit: 10})

  const pageCntCallback = useCallback((pageCount: number) => {
    setConfig((prevState) => {return {...prevState, pageCnt: pageCount}})
  }, [])

  const changePage = (page: number) => {
    setConfig((prevState) => {return {...prevState, page: page}})
  }

  const sortingCallback = useCallback((key: sort_type, dir: SORTING_DIRECTION) => {
    setConfig((prevState) => {return {...prevState, sort: key, sortDirection: dir}})
  }, [])

  const coreProps = {api, page, cells, keyGen, pageCnt: pageCntCallback, limit, sortDir: sortDirection}

  return (
      <>
        <DatatableContext.Provider value={{setSortBy: sortingCallback, curSortBy: sort, curSortDir: sortDirection}}>
          <table>
            {header}
            <tbody>
            {
              serverSide?
                  <DatatableCoreServerSide<T>
                      sort={sort as string}
                      {...coreProps}
                  />:
                  <DatatableCoreClientSide<T>
                      sort={sort as number}
                      {...coreProps}
                  />
            }
            </tbody>
          </table>
          <Pagination pageCnt={pageCnt} page={page} changePage={changePage} />
        </DatatableContext.Provider>
      </>
  )
}

function Pagination({pageCnt, page, changePage}: {pageCnt: number, page: number, changePage: (page: number) => void}) {
  const { t } = useTranslation("datatable")
  let pageOptions: Array<[Key, number]> = []
  if(pageCnt < 7) {
    //no separator
    for(let i = 1; i <= pageCnt; i++) {
      pageOptions.push([i, i])
    }
  } else if(page < 4) {
    //no separator in the front
    for(let i = 1; i <= 5; i++) {
      pageOptions.push([i, i])
    }
    pageOptions.push(["e", -1])
    pageOptions.push([pageCnt, pageCnt])
  } else if(page > pageCnt - 5) {
    //no separator in the back
    pageOptions.push([1, 1])
    pageOptions.push(["s", -1])
    for(let i = pageCnt - 4; i <= pageCnt; i++) {
      pageOptions.push([i, i])
    }
  } else {
    //both needed
    pageOptions.push([1, 1])
    pageOptions.push(["s", -1])
    pageOptions.push([page, page])
    pageOptions.push([page + 1, page + 1])
    pageOptions.push([page + 2, page + 2])
    pageOptions.push(["e", -1])
    pageOptions.push([pageCnt, pageCnt])
  }

  return (
      <div>
        <button  onClick={() => changePage((page > 0)?(page - 1):0)}>{t("oPaginate_sPrevious")}</button>
        {pageOptions.map(p => {
          if(p[1] === -1) {
            return <div key={p[0]}>...</div>
          }
          return (
              <button key={p[0]} className={(page + 1 === p[1])?"active":""} onClick={() => changePage(p[1] - 1)}>{p[1]}</button>
          )
        })}
        <button  onClick={() => changePage((page < pageCnt - 1)?(page + 1):pageCnt)}>{t("oPaginate_sNext")}</button>
      </div>
  )
}

export {DatatableContext, SORTING_DIRECTION}
