import React, {ChangeEvent, createContext, Key, ReactNode, useCallback, useMemo} from "react";
import DatatableCoreServerSide from "./DatatableCoreServerSide";
import DatatableCoreClientSide from "./DatatableCoreClientSide";
import Pagination from "./Pagination";
import {useTranslation} from "react-i18next";
import {nf} from "../UtilFunctions";
import usePersistentState from "../persitentState";
import {Dict} from "../customTypes";
import {Col, Form, InputGroup, Row, Table} from "react-bootstrap";
import DatatableHeaderBuilder from "./DatatableHeaderBuilder";
import {useBreakpointIdx} from "../bootrapBreakpoints";


export enum SORTING_DIRECTION {
  ASC,
  DESC,
}

type sort_type = string | number
type sort_arr_type = Array<[sort_type, SORTING_DIRECTION]>
type persistentStateType = {limit: number, sort: sort_arr_type}
type volatileStateType = {page: number, totalCount: number, filteredCount: number, search?: string}

interface apiProps {
  api: string,
  api_params?: Dict<any>,
}

interface externalCellProps<T> {
  cells: Array<(data: T) => string | JSX.Element>,
  keyGen: (data: T) => Key,
  rowClassGen?: (data: T) => string | undefined,
  cellClasses?: string[]
}

export interface internalCellProps<T> extends externalCellProps<T> {
  visibleCells: number[],
  invisibleCells: number[],
  headerNames: ReactNode[],
}

export interface coreProps<T> extends apiProps, internalCellProps<T> {
  page: number,
  limit: number,
  itemCntCallback: (totalCount: number, filteredCount: number)=> void,
  search?: string,
}

interface paramsType<T> extends apiProps, externalCellProps<T> {
  header: DatatableHeaderBuilder,
  serverSide: boolean,
  defaultSort?: [sort_type, SORTING_DIRECTION],
  saveAs: string,
  topBarMiddle?: JSX.Element,
  topBarEnd?: JSX.Element,
  responsiveTable?: boolean,
  striped?: boolean,
  searching?: boolean | ((data: T, search: string) => boolean),
}

export const DatatableContext = createContext<{setSortBy?: (key: sort_type, dir: SORTING_DIRECTION, append: boolean) => void,
  curSortBy?: Array<[sort_type, SORTING_DIRECTION]>}>({})


export default function DatatableBase<T>({header, serverSide, defaultSort, saveAs, topBarMiddle, topBarEnd, cellClasses,
                                           responsiveTable, striped, searching, ...unusedProps}: paramsType<T>) {
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
  }, [setVolatile])

  const lengthMenu = t('sLengthMenu')
  const lengthMenu_idx = lengthMenu.indexOf("_MENU_")
  const lengthMenu_pre = lengthMenu.substring(0, lengthMenu_idx)
  const lengthMenu_post = lengthMenu.substring(lengthMenu_idx + "_MENU_".length)

  const curBreakpoint = useBreakpointIdx()
  const [headerNode, colVisible, colInvisible, headerNames] = useMemo(() => {
    return [header.buildNodes(cellClasses), header.getScreenVisibilityMapping(), header.getOffVisibilityMapping(), header.getNames()]
  }, [header, cellClasses])
  const visibleCells = colVisible[curBreakpoint]
  const invisibleCells = colInvisible[curBreakpoint]

  const coreProps = {
    page, visibleCells, invisibleCells, headerNames, itemCntCallback, limit, search, cellClasses, ...unusedProps
  }

  return (
      <div>
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
            {topBarEnd}
          </Row>
          <Row className={"mb-3" + (responsiveTable?" table-responsive":"")}>
            <Table striped={striped === undefined?true:striped} hover className={responsiveTable?"nowrap":""}>
              {headerNode}
              <tbody>
              {
                serverSide?
                    <DatatableCoreServerSide<T>
                        sort={sort as Array<[string, SORTING_DIRECTION]>}
                        {...coreProps}
                    />:
                    <DatatableCoreClientSide<T>
                        sort={sort as Array<[number, SORTING_DIRECTION]>}
                        searchCB={(searching !== true && searching !== false)?searching:undefined}
                        {...coreProps}
                    />
              }
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
      </div>
  )
}
