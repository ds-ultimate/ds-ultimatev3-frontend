import React, {MouseEvent, ReactNode, useContext} from "react";
import {DatatableContext, SORTING_DIRECTION} from "./DatatableBase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSort, faSortDesc, faSortUp} from "@fortawesome/free-solid-svg-icons";

type paramsType = {children: ReactNode, sortBy?: string, sortDescDefault?: boolean}

type mEventType = MouseEvent<HTMLTableHeaderCellElement>

export default function DatatableHeader({children, sortBy, sortDescDefault}: paramsType) {
  const {setSortBy, curSortBy} = useContext(DatatableContext)

  let sortingIcon: ReactNode = undefined
  if(sortBy) {
    const curSortFound = curSortBy?.find(([elm, _dir]) => elm === sortBy)
    if(curSortFound) {
      if(curSortFound[1] === SORTING_DIRECTION.ASC) {
        sortingIcon = <FontAwesomeIcon icon={faSortUp} />
      } else {
        sortingIcon = <FontAwesomeIcon icon={faSortDesc} />
      }
    } else {
      sortingIcon = <FontAwesomeIcon icon={faSort} />
    }
  }

  let onclickHandler = undefined
  if(sortBy !== undefined && setSortBy !== undefined) {
    onclickHandler = (event: mEventType) =>
        setSortBy(sortBy, sortDescDefault?SORTING_DIRECTION.DESC:SORTING_DIRECTION.ASC, event.ctrlKey)
  }

  return (
        <th onClick={onclickHandler}>
          {children}
          {sortingIcon}
        </th>
  )
}
