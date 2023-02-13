import React, {ReactNode, useContext} from "react";
import {DatatableContext, SORTING_DIRECTION} from "./DatatableBase";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSort, faSortDesc, faSortUp} from "@fortawesome/free-solid-svg-icons";

type paramsType = {children: ReactNode, sortBy?: string, sortDescDefault?: boolean}

export default function DatatableHeader({children, sortBy, sortDescDefault}: paramsType) {
  const {setSortBy, curSortBy, curSortDir} = useContext(DatatableContext)

  let sortingIcon: ReactNode = undefined
  if(sortBy !== undefined) {
    if(curSortBy === sortBy) {
      if(curSortDir === SORTING_DIRECTION.ASC) {
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
    if(curSortBy === sortBy) {
      if(curSortDir === SORTING_DIRECTION.ASC) {
        onclickHandler = () => setSortBy(sortBy, SORTING_DIRECTION.DESC)
      } else {
        onclickHandler = () => setSortBy(sortBy, SORTING_DIRECTION.ASC)
      }
    } else {
      onclickHandler = () => setSortBy(sortBy, sortDescDefault?SORTING_DIRECTION.DESC:SORTING_DIRECTION.ASC)
    }
  }

  return (
        <th onClick={onclickHandler}>
          {children}
          {sortingIcon}
        </th>
  )
}
