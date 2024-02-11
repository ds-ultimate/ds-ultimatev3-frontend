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

import React, {MouseEvent, ReactNode, useContext, useMemo} from "react";
import {DatatableContext, SORTING_DIRECTION} from "./DatatableBase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSort, faSortDesc, faSortUp} from "@fortawesome/free-solid-svg-icons";
import styles from "./Datatable.module.scss"
import {Breakpoint, breakpoints, useBreakpointIdx} from "../bootrapBreakpoints";

type paramsType = {
  children: ReactNode
  sortBy?: string | number
  sortDescDefault?: boolean
  showAt: Breakpoint[]
  className?: string
}

type mEventType = MouseEvent<HTMLTableHeaderCellElement>

export default function DatatableHeader({children, sortBy, sortDescDefault, showAt, className}: paramsType) {
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
  if(sortBy !== undefined) {
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
        <th onClick={onclickHandler} colSpan={colspan} className={className}>
          {children}
          {sortingIcon}
        </th>
  )
}
