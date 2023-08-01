import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React from "react";
import {useAllyData} from "../../../../apiInterface/loadContent";
import ErrorPage from "../../../layout/ErrorPage";
import {DecodeName} from "../../../../util/UtilFunctions";
import AllyChangePage, {FILTER_OPTIONS} from "../AllyChangePage";
import {allyAllyChangeTable} from "../../../../apiInterface/apiConf";
import {FrontendError} from "../../../layout/ErrorPages/ErrorTypes"

const filterPossible = [
  FILTER_OPTIONS.PLAYER,
  FILTER_OPTIONS.OLD_ALLY,
  FILTER_OPTIONS.NEW_ALLY,
]
export default function AllyAllyChangePage() {
  const {server, world, type, ally} = useParams()
  const {t} = useTranslation("ui")
  const [allyErr, allyData] = useAllyData(server, world, ally)

  if(allyErr) return <ErrorPage error={allyErr} />

  let reducedFilters: string[]
  let typeName: string
  if(type === "all") {
    typeName = t("allyChanges.all")
    reducedFilters = filterPossible.slice()
  } else if(type === "old") {
    typeName = t("allyChanges.old")
    reducedFilters = filterPossible.filter(value => value !== FILTER_OPTIONS.OLD_ALLY)
  } else if(type === "new") {
    typeName = t("allyChanges.new")
    reducedFilters = filterPossible.filter(value => value !== FILTER_OPTIONS.NEW_ALLY)
  } else {
    const errData: FrontendError = {
      isFrontend: true,
      code: 404,
      k: "404.unknownType",
      p: {type},
    }
    return <ErrorPage error={errData} />
  }

  const who = <>{<DecodeName name={allyData?.cur?.name ?? allyData?.top?.name ?? ""} />}</>
  return <>{ally && <AllyChangePage
      typeName={typeName}
      who={who}
      allyChangeSave={"allyAllyChanges"}
      filterPossible={reducedFilters}
      api={allyAllyChangeTable({server, world, type, ally})}
  />}</>
};
