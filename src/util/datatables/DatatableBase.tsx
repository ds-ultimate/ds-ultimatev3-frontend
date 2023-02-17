import React, {ChangeEvent, createContext, Key, useCallback} from "react";
import DatatableCoreServerSide from "./DatatableCoreServerSide";
import DatatableCoreClientSide from "./DatatableCoreClientSide";
import Pagination from "./Pagination";
import {useTranslation} from "react-i18next";
import {nf} from "../UtilFunctions";
import usePersistentState from "../persitentState";
import {Dict} from "../customTypes";

type paramsType<T> = {
  api: string,
  header: JSX.Element,
  serverSide?: boolean,
  cells: Array<(data: T) => string | JSX.Element>,
  keyGen: (data: T) => Key,
  rowClassGen?: (data: T) => string | undefined,
  defaultSort?: [sort_type, SORTING_DIRECTION],
  saveAs: string,
  api_params?: Dict<any>,
  topBarMiddle?: JSX.Element,
}

type sort_type = string | number
type persistentStateType = {limit: number, sort: Array<[sort_type, SORTING_DIRECTION]>}
type volatileStateType = {page: number, totalCount: number, filteredCount: number, search?: string}

const DatatableContext = createContext<{setSortBy?: (key: sort_type, dir: SORTING_DIRECTION, append: boolean) => void,
  curSortBy?: Array<[sort_type, SORTING_DIRECTION]>}>({})

enum SORTING_DIRECTION {
  ASC,
  DESC,
}

export default function DatatableBase<T>({api, header, serverSide, cells, keyGen, rowClassGen, defaultSort, saveAs,
                                          api_params, topBarMiddle}: paramsType<T>) {
  // TODO think how to do optional filtering
  const { t } = useTranslation("datatable")
  const [[{limit, sort}, {page, totalCount, filteredCount, search}], setConfig, setPersistent, setVolatile] =
      usePersistentState<persistentStateType, volatileStateType>("datatable." + saveAs,
          [{limit: 10, sort: (defaultSort)?[defaultSort]:[]}, {page: 0, totalCount: 1, filteredCount: 1}])

  const itemCntCallback = useCallback((totalCount: number, filteredCount: number) => {
    setVolatile((prevState) => {return {...prevState, totalCount, filteredCount}})
  }, [setVolatile])

  const changePage = useCallback((page: number) => {
    setVolatile((prevState) => {return {...prevState, page}})
  }, [setVolatile])

  const sortingCallback = useCallback((key: sort_type, defaultDir: SORTING_DIRECTION, append: boolean) => {
    setPersistent((oldP) => {
      let newDir: SORTING_DIRECTION | undefined = defaultDir
      const index = oldP.sort.findIndex((elm) => elm[0] === key)
      if(index !== -1) {
        if (oldP.sort[index][1] === defaultDir) {
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
        let newSort = [...oldP.sort]
        if(index === -1) {
          newSort.push([key, newDir as SORTING_DIRECTION])
        } else if(newDir !== undefined) {
          newSort[index] = [newSort[index][0], newDir]
        } else {
          newSort = [...newSort.slice(0, index), ...newSort.slice(index + 1)]
        }
        return {...oldP, sort: newSort}
      }
      if(newDir !== undefined) {
        return {...oldP, sort: [[key, newDir]]}
      } else {
        return {...oldP, sort: []}
      }
    })
  }, [setPersistent])

  const limitSelectCallback = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setConfig(([oldP, oldV]) => {
      const newLimit = parseInt(event.target.value)
      const start = oldP.limit * oldV.page
      const newPage = Math.floor(start / newLimit)
      return [{...oldP, limit: newLimit}, {...oldV, page: newPage}]
    })
  }, [setConfig])

  const searchChangeCallback = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    let val: string | undefined = event.target.value
    if(val === "") {
      val =  undefined
    }
    setVolatile((prevState) => { return {...prevState, search: val}})
  }, [setConfig])

  const lengthMenu = t('sLengthMenu')
  const lengthMenu_idx = lengthMenu.indexOf("_MENU_")
  const lengthMenu_pre = lengthMenu.substring(0, lengthMenu_idx)
  const lengthMenu_post = lengthMenu.substring(lengthMenu_idx + "_MENU_".length)

  const coreProps = {api, page, cells, keyGen, itemCntCallback, limit, search, rowClassGen, api_params}

  return (
      <>
        <div className={"datatable-top-bar"}>
          <div className={"datatable-amount-selector"}>
            {lengthMenu_pre}
            <select onChange={limitSelectCallback} defaultValue={limit}>
              {[10, 25, 50, 100].map(l => (
                  <option key={l}>{l}</option>
              ))}
            </select>
            {lengthMenu_post}
          </div>
          {topBarMiddle}
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
