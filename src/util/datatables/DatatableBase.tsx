import React, {ChangeEvent, createContext, Key, useCallback, useState} from "react";
import DatatableCoreServerSide from "./DatatableCoreServerSide";
import DatatableCoreClientSide from "./DatatableCoreClientSide";
import Pagination from "./Pagination";
import {useTranslation} from "react-i18next";
import {nf} from "../UtilFunctions";

type paramsType<T> = {api: string, header: JSX.Element, serverSide?: boolean,
  cells: Array<(data: T) => string | JSX.Element>, keyGen: (data: T) => Key, defaultSort?: [sort_type, SORTING_DIRECTION]}

type sort_type = string | number
type stateType = {page: number, totalCount: number, filteredCount: number, limit: number,
  sort: Array<[sort_type, SORTING_DIRECTION]>, search?: string}

const DatatableContext = createContext<{setSortBy?: (key: sort_type, dir: SORTING_DIRECTION, append: boolean) => void,
  curSortBy?: Array<[sort_type, SORTING_DIRECTION]>}>({})

enum SORTING_DIRECTION {
  ASC,
  DESC,
}

export default function DatatableBase<T>({api, header, serverSide, cells, keyGen, defaultSort}: paramsType<T>) {
  // TODO save / read setting from localStorage
  // TODO think how to do optional filtering
  const { t } = useTranslation("datatable")
  const [{page, totalCount, filteredCount, limit, sort, search}, setConfig] =
      useState<stateType>({page: 0, totalCount: 1, filteredCount: 1, limit: 10, sort: (defaultSort)?[defaultSort]:[]})

  const itemCntCallback = useCallback((totalCount: number, filteredCount: number) => {
    setConfig((prevState) => {return {...prevState, totalCount, filteredCount}})
  }, [])

  const changePage = (page: number) => {
    setConfig((prevState) => {return {...prevState, page: page}})
  }

  const sortingCallback = useCallback((key: sort_type, defaultDir: SORTING_DIRECTION, append: boolean) => {
    setConfig((prevState) => {
      let newDir: SORTING_DIRECTION | undefined = defaultDir
      const index = prevState.sort.findIndex((elm) => elm[0] === key)
      if(index !== -1) {
        if (prevState.sort[index][1] === defaultDir) {
          if (defaultDir === SORTING_DIRECTION.ASC) {
            newDir = SORTING_DIRECTION.DESC
          } else {
            newDir = SORTING_DIRECTION.ASC
          }
        } else {
          newDir = undefined
        }
      }

      if(append) {
        let newSort = [...prevState.sort]
        if(index === -1) {
          newSort.push([key, newDir as SORTING_DIRECTION])
        } else if(newDir !== undefined) {
          newSort[index] = [newSort[index][0], newDir]
        } else {
          newSort = [...newSort.slice(0, index), ...newSort.slice(index + 1)]
        }
        return {...prevState, sort: newSort}
      }
      if(newDir !== undefined) {
        return {...prevState, sort: [[key, newDir]]}
      } else {
        return {...prevState, sort: []}
      }
    })
  }, [])

  const limitSelectCallback = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setConfig((prevState) => {
      const newLimit = parseInt(event.target.value)
      const start = prevState.limit * prevState.page
      const newPage = Math.floor(start / newLimit)
      return {...prevState, limit: newLimit, page: newPage}
    })
  }, [])

  const searchChangeCallback = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    let val: string | undefined = event.target.value
    if(val === "") {
      val =  undefined
    }
    setConfig((prevState) => { return {...prevState, search: val}})
  }, [])

  const lengthMenu = t('sLengthMenu')
  const lengthMenu_idx = lengthMenu.indexOf("_MENU_")
  const lengthMenu_pre = lengthMenu.substring(0, lengthMenu_idx)
  const lengthMenu_post = lengthMenu.substring(lengthMenu_idx + "_MENU_".length)

  const coreProps = {api, page, cells, keyGen, itemCntCallback, limit, search}

  return (
      <>
        <div className={"datatable-top-bar"}>
          <div className={"datatable-amount-selector"}>
            {lengthMenu_pre}
            <select onChange={limitSelectCallback}>
              <option>10</option>
              <option>25</option>
              <option>50</option>
              <option>100</option>
            </select>
            {lengthMenu_post}
          </div>
          <div className={"datatable-search"}>
            {t('sSearch')}
            <input type={"text"} onChange={searchChangeCallback} />
          </div>
        </div>
        <DatatableContext.Provider value={{setSortBy: sortingCallback, curSortBy: sort}}>
          <table>
            {header}
            <tbody>
            {
              serverSide?
                  <DatatableCoreServerSide<T>
                      sort={sort as Array<[string, SORTING_DIRECTION]>}
                      {...coreProps}
                  />:
                  <DatatableCoreClientSide<T>
                      sort={sort as Array<[number, SORTING_DIRECTION]>}
                      {...coreProps}
                  />
            }
            </tbody>
          </table>
          <div className={"datatable-footer"}>
            <div className={"datatable-info"}>
              {t('sInfo', {start: nf.format(page*limit + 1), end: nf.format(Math.min((page+1) * limit, filteredCount)), total: nf.format(filteredCount)})}
              {filteredCount !== totalCount && (" " + t('sInfoFiltered', {max: nf.format(totalCount)}))}
            </div>
            <Pagination pageCnt={Math.ceil(filteredCount / limit)} page={page} changePage={changePage} />
          </div>
        </DatatableContext.Provider>
      </>
  )
}

export {DatatableContext, SORTING_DIRECTION}
