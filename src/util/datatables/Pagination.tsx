import {useTranslation} from "react-i18next";
import React, {Key} from "react";

export default function Pagination({pageCnt, page, changePage}: {pageCnt: number, page: number, changePage: (page: number) => void}) {
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
      <div className={"datatable-pagination"}>
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
