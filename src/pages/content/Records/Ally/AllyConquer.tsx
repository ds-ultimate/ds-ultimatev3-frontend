import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React from "react";
import {conquerChangeType, highlightRefType} from "../../../../modelHelper/Conquer";
import ConquerPage, {FILTER_OPTIONS} from "../../../layout/ConquerPage";
import {useAllyData} from "../../../../apiInterface/loadContent";
import ErrorPage from "../../../layout/ErrorPage";
import {allyConquerTable} from "../../../../apiInterface/apiConf";
import {DecodeName} from "../../../../util/UtilFunctions";
import {FrontendError} from "../../../layout/ErrorPages/ErrorTypes"

const highlightPossible: conquerChangeType[] = [
  conquerChangeType.SELF,
  conquerChangeType.INTERNAL,
  conquerChangeType.BARBARIAN,
  //conquerChangeType.DELETION,
  conquerChangeType.LOOSE,
  conquerChangeType.WIN,
]

const filterPossible = [
  FILTER_OPTIONS.VILLAGE,
  FILTER_OPTIONS.OLD_PLAYER,
  FILTER_OPTIONS.OLD_ALLY,
  FILTER_OPTIONS.NEW_PLAYER,
  FILTER_OPTIONS.NEW_ALLY,
]

const conquerTypeFilterPossible = [
  conquerChangeType.NORMAL,
  conquerChangeType.SELF,
  conquerChangeType.INTERNAL,
  conquerChangeType.BARBARIAN,
  //conquerChangeType.DELETION,
]

export default function AllyConquerPage() {
  const {server, world, type, ally} = useParams()
  const {t} = useTranslation("ui")
  const [allyErr, allyData] = useAllyData(server, world, ally)

  if(allyErr) return <ErrorPage error={allyErr} />

  let reducedFilters: string[]
  let typeName: string
  if(type === "all") {
    typeName = t("conquer.all")
    reducedFilters = filterPossible.slice()
  } else if(type === "old") {
    typeName = t("conquer.lost")
    reducedFilters = filterPossible.filter(value => value !== FILTER_OPTIONS.OLD_ALLY)
  } else if(type === "new") {
    typeName = t("conquer.won")
    reducedFilters = filterPossible.filter(value => value !== FILTER_OPTIONS.NEW_ALLY)
  } else if(type === "own") {
    //TODO filter backend data and set new / old ally_id to value x if player only left for < 5h. This should fix wrong internal conquer count
    typeName = t("conquer.allyOwn")
    reducedFilters = filterPossible.filter(value => value !== FILTER_OPTIONS.OLD_ALLY && value !== FILTER_OPTIONS.NEW_ALLY)
  } else {
    const errData: FrontendError = {
      isFrontend: true,
      code: 404,
      k: "404.unknownType",
      p: {type},
    }
    return <ErrorPage error={errData} />
  }

  const who = <>{allyData?.cur && <DecodeName name={allyData.cur.name} />}</>
  return <>{ally && <ConquerPage
      typeName={typeName}
      who={who}
      conquerSave={"allyConquer"}
      highlightPossible={highlightPossible}
      highlightRef={[highlightRefType.ALLY, +ally]}
      filterPossible={reducedFilters}
      conquerTypeFilterPossible={conquerTypeFilterPossible}
      api={allyConquerTable({server, world, type, ally})}
  />}</>
};
