import React, {MouseEvent, ReactNode, useContext, useMemo} from "react";
import {DatatableContext, SORTING_DIRECTION} from "./DatatableBase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSort, faSortDesc, faSortUp} from "@fortawesome/free-solid-svg-icons";
import styles from "./Datatable.module.scss"
import {Breakpoint, breakpoints, useBreakpointIdx} from "../bootrapBreakpoints";

type paramsType = {
  children: ReactNode,
  sortBy?: string,
  sortDescDefault?: boolean
  showAt: Breakpoint[]
}

type mEventType = MouseEvent<HTMLTableHeaderCellElement>

export default function DatatableHeader({children, sortBy, sortDescDefault, showAt}: paramsType) {
  const {setSortBy, curSortBy} = useContext(DatatableContext)
  const breakPoint = useBreakpointIdx()

  const bpSizes = useMemo(() => {
    return breakpoints.map((_val, idx) => {
      const slice = breakpoints.slice(0, idx + 1)
      return showAt.filter(showVal => slice.includes(showVal)).length
    })
  }, [showAt])

  const colspan = bpSizes[breakPoint]
  if(colspan === 0) {
    return null
  }

  let sortingIcon: ReactNode = undefined
  if(sortBy) {
    const curSortFound = curSortBy?.find(([elm, _dir]) => elm === sortBy)
    if(curSortFound) {
      if(curSortFound[1] === SORTING_DIRECTION.ASC) {
        sortingIcon = <FontAwesomeIcon className={styles.sortActive} icon={faSortUp} />
      } else {
        sortingIcon = <FontAwesomeIcon className={styles.sortActive} icon={faSortDesc} />
      }
    } else {
      sortingIcon = <FontAwesomeIcon className={styles.sortInactive} icon={faSort} />
    }
  }

  let onclickHandler = undefined
  if(sortBy !== undefined && setSortBy !== undefined) {
    onclickHandler = (event: mEventType) =>
        setSortBy(sortBy, sortDescDefault?SORTING_DIRECTION.DESC:SORTING_DIRECTION.ASC, event.ctrlKey)
  }

  return (
        <th onClick={onclickHandler} colSpan={colspan}>
          {children}
          {sortingIcon}
        </th>
  )
}
