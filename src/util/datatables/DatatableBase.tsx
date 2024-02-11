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

import React, {ChangeEvent, createContext, Key, MouseEvent, ReactNode, useCallback, useMemo, useState} from "react";
import DatatableCoreServerSide from "./DatatableCoreServerSide";
import DatatableCoreClientSide from "./DatatableCoreClientSide";
import Pagination from "./Pagination";
import {useTranslation} from "react-i18next";
import {nf} from "../UtilFunctions";
import useMixedState from "../mixedState";
import {Dict} from "../customTypes";
import {Col, Form, InputGroup, Row, Table} from "react-bootstrap";
import DatatableHeaderBuilder from "./DatatableHeaderBuilder";
import {useBreakpointIdx} from "../bootrapBreakpoints";
import LoadingScreen from "../../pages/layout/LoadingScreen";
import DatatableCoreData from "./DatatableCoreData";
import {exportConverterType, ExportDataEvent, exporterType} from "./exporter/exporterBase";
import {ExporterCSV} from "./exporter/exporterCSV";


export enum SORTING_DIRECTION {
  ASC,
  DESC,
}

export enum DATATABLE_VARIANT {
  SERVER_SIDE,
  CLIENT_SIDE,
  DATA,
}

export const Exporters = {
  "CSV": ExporterCSV,
}

type sort_type = string | number
type sort_arr_type = Array<[sort_type, SORTING_DIRECTION]>
type persistentStateType = {limit: number, sort: sort_arr_type}
type volatileStateType = {page: number, totalCount: number, filteredCount: number, search?: string}

export interface apiProps {
  api: string,
  api_params?: Dict<any>,
}

interface externalCellProps<T> {
  cells: Array<(data: T) => string | React.ReactNode>,
  keyGen: (data: T) => Key,
  rowClassGen?: (data: T) => string | undefined,
  rowOnClick?: (data: T, evt: MouseEvent<HTMLTableRowElement>) => void,
  cellClasses?: string[],
}

export interface internalCellProps<T> extends externalCellProps<T> {
  visibleCells: number[],
  invisibleCells: number[],
  headerNames: ReactNode[],
}

export interface coreProps<T> extends internalCellProps<T> {
  page: number,
  limit: number,
  itemCntCallback: (totalCount: number, filteredCount: number)=> void,
  search?: string,
  exportEvent: ExportDataEvent | undefined,
  setExportEvent: (d: undefined) => void,
  exportConverter?: exportConverterType<T>,
}

interface paramsType<T> extends Partial<apiProps>, externalCellProps<T> {
  header: DatatableHeaderBuilder<T>,
  variant: DATATABLE_VARIANT,
  defaultSort?: [sort_type, SORTING_DIRECTION],
  saveAs: string,
  topBarMiddle?: React.ReactNode,
  topBarEnd?: React.ReactNode,
  responsiveTable?: boolean,
  striped?: boolean,
  searching?: boolean | ((data: T, search: string) => boolean),
  exports?: Array<exporterType>,
  exportConverter?: exportConverterType<T>,
  exportFileName?: string,
  data?: T[],
}

export const DatatableContext = createContext<{setSortBy?: (key: sort_type, dir: SORTING_DIRECTION, append: boolean) => void,
  curSortBy?: Array<[sort_type, SORTING_DIRECTION]>}>({})


export default function DatatableBase<T>({header, variant, defaultSort, saveAs, topBarMiddle, topBarEnd, cellClasses,
                                           responsiveTable, striped, searching, exports, exportConverter,
                                           exportFileName, ...unusedProps}: paramsType<T>) {
  const { t } = useTranslation("datatable")
  const [[{limit, sort}, {page, totalCount, filteredCount, search}], setConfig, setPersistent, setVolatile] =
      useMixedState<persistentStateType, volatileStateType>("datatable." + saveAs,
          [{limit: 10, sort: (defaultSort)?[defaultSort]:[]}, {page: 0, totalCount: 1, filteredCount: 1}])

  const itemCntCallback = useCallback((totalCount: number, filteredCount: number) => {
    setVolatile((prevState) => ({...prevState, totalCount, filteredCount}))
  }, [setVolatile])

  const changePage = useCallback((page: number) => {
    setVolatile((prevState) => ({...prevState, page}))
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
  }, [setVolatile])

  const lengthMenu = t('sLengthMenu')
  const lengthMenu_idx = lengthMenu.indexOf("_MENU_")
  const lengthMenu_pre = lengthMenu.substring(0, lengthMenu_idx)
  const lengthMenu_post = lengthMenu.substring(lengthMenu_idx + "_MENU_".length)

  const curBreakpoint = useBreakpointIdx()
  const [headerNode, colVisible, colInvisible, headerNames, headerSortCB] = useMemo(() => {
    return [header.buildNodes(cellClasses), header.getScreenVisibilityMapping(), header.getOffVisibilityMapping(), header.getNames(), header.getSortingCB()]
  }, [header, cellClasses])
  const visibleCells = colVisible[curBreakpoint]
  const invisibleCells = colInvisible[curBreakpoint]

  const {data, api, api_params, ...coreProps} = {
    page, visibleCells, invisibleCells, headerNames, itemCntCallback, limit, search, cellClasses, ...unusedProps
  }

  const [exportEvent, setExportEvent] = useState<ExportDataEvent | undefined>(undefined)

  let coreElement: ReactNode = undefined
  if(variant === DATATABLE_VARIANT.SERVER_SIDE) {
    if(!api) {
      throw new Error("Api is undefined with type server side!")
    }
    coreElement = (
      <DatatableCoreServerSide<T>
        api={api}
        api_params={api_params}
        sort={sort as Array<[string, SORTING_DIRECTION]>}
        exportEvent={exportEvent}
        setExportEvent={setExportEvent}
        exportConverter={exportConverter}
        {...coreProps}
      />
    )
  } else if (variant === DATATABLE_VARIANT.CLIENT_SIDE) {
    if(!api) {
      throw new Error("Api is undefined with type client side!")
    }
    coreElement = (
      <DatatableCoreClientSide<T>
        api={api}
        api_params={api_params}
        sort={sort as Array<[number, SORTING_DIRECTION]>}
        searchCB={(searching !== true && searching !== false)?searching:undefined}
        sortCB={headerSortCB}
        exportEvent={exportEvent}
        setExportEvent={setExportEvent}
        exportConverter={exportConverter}
        {...coreProps}
      />
    )
  } else if(variant === DATATABLE_VARIANT.DATA) {
    if(!data) {
      throw new Error("Data is undefined with type data!")
    }
    coreElement = (
      <DatatableCoreData<T>
        data={data}
        sort={sort as Array<[number, SORTING_DIRECTION]>}
        searchCB={(searching !== true && searching !== false)?searching:undefined}
        sortCB={headerSortCB}
        exportEvent={exportEvent}
        setExportEvent={setExportEvent}
        exportConverter={exportConverter}
        {...coreProps}
      />
    )
  }

  if(exports !== undefined && exportConverter === undefined) {
    throw Error("Converter needs to set if exports are activated")
  }

  return (
      <div>
        <LoadingScreen big>
          <DatatableContext.Provider value={{setSortBy: sortingCallback, curSortBy: sort}}>
            <Row className={"mb-2"}>
              <Col xs={12} md={"auto"} className={"mb-2"}>
                <InputGroup>
                  {lengthMenu_pre && <InputGroup.Text>{lengthMenu_pre}</InputGroup.Text>}
                  <Form.Select onChange={limitSelectCallback} defaultValue={limit}>
                    {[10, 25, 50, 100].map(l => (
                        <option key={l}>{l}</option>
                    ))}
                  </Form.Select>
                  {lengthMenu_post && <InputGroup.Text>{lengthMenu_post}</InputGroup.Text>}
                </InputGroup>
              </Col>
              {topBarMiddle}
              {searching && <Col xs={12} md={"auto"} className={"ms-md-auto mb-2"}>
                <InputGroup>
                  <InputGroup.Text>{t('sSearch')}</InputGroup.Text>
                  <Form.Control
                    placeholder={t('sSearch') ?? undefined}
                    aria-label={t('sSearch') ?? undefined}
                    onChange={searchChangeCallback}
                  />
                </InputGroup>
              </Col>}
              {exports && exports.map((ExportComponent, i) => {
                if(exportFileName === undefined) {
                  throw Error("Filename needs to set if exports are activated")
                }
                return (
                  <ExportComponent key={i} exportHandler={setExportEvent} leftAuto={!searching} fileName={exportFileName} />
                )
              })}
              {topBarEnd}
            </Row>
            <Row className={"mb-3"}>
              <Table striped={striped === undefined?true:striped} hover className={responsiveTable?"nowrap":""} responsive={responsiveTable}>
                {headerNode}
                <tbody>
                {coreElement}
                </tbody>
              </Table>
            </Row>
            <Row>
              <Col xs={"auto"} className={"mb-2"}>
                {t('sInfo', {start: nf.format(page*limit + 1), end: nf.format(Math.min((page+1) * limit, filteredCount)), total: nf.format(filteredCount)})}
                {filteredCount !== totalCount && (" " + t('sInfoFiltered', {max: nf.format(totalCount)}))}
              </Col>
              <Col xs={"auto"} className={"ms-auto mb-2"}>
                <Pagination pageCnt={Math.ceil(filteredCount / limit)} page={page} changePage={changePage} />
              </Col>
            </Row>
          </DatatableContext.Provider>
        </LoadingScreen>
      </div>
  )
}
