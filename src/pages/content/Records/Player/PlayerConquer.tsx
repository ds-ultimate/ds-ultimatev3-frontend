import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React from "react";
import {conquerChangeType, highlightRefType} from "../../../../modelHelper/Conquer";
import ConquerPage, {FILTER_OPTIONS} from "../../../layout/ConquerPage";
import ErrorPage from "../../../layout/ErrorPage";
import {playerConquerTable} from "../../../../apiInterface/apiConf";
import {rawDecodeName} from "../../../../util/UtilFunctions";
import {FrontendError} from "../../../layout/ErrorPages/ErrorTypes"
import {usePlayerData} from "../../../../apiInterface/loaders/player"

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

export default function PlayerConquerPage() {
  const {server, world, type, player} = useParams()
  const {t} = useTranslation("ui")
  const [playerErr, playerData] = usePlayerData(server, world, player)

  if(playerErr) return <ErrorPage error={playerErr} />

  let reducedFilters: string[]
  let typeName: string
  if(type === "all") {
    typeName = t("conquer.all")
    reducedFilters = filterPossible.slice()
  } else if(type === "old") {
    typeName = t("conquer.lost")
    reducedFilters = filterPossible.filter(value => value !== FILTER_OPTIONS.OLD_PLAYER)
  } else if(type === "new") {
    typeName = t("conquer.won")
    reducedFilters = filterPossible.filter(value => value !== FILTER_OPTIONS.NEW_PLAYER)
  } else if(type === "own") {
    //TODO filter backend data and set new / old ally_id to value x if player only left for < 5h. This should fix wrong internal conquer count
    typeName = t("conquer.playerOwn")
    reducedFilters = filterPossible.filter(value => value !== FILTER_OPTIONS.OLD_PLAYER && value !== FILTER_OPTIONS.NEW_PLAYER)
  } else {
    const errData: FrontendError = {
      isFrontend: true,
      code: 404,
      k: "404.unknownType",
      p: {type},
    }
    return <ErrorPage error={errData} />
  }

  const who = playerData?.cur?rawDecodeName(playerData.cur.name):(playerData?.top?rawDecodeName(playerData.top.name):undefined)
  return <>{player && <ConquerPage
      typeName={typeName}
      who={who}
      conquerSave={"playerConquer"}
      highlightPossible={highlightPossible}
      highlightRef={[highlightRefType.PLAYER, +player]}
      filterPossible={reducedFilters}
      conquerTypeFilterPossible={conquerTypeFilterPossible}
      api={playerConquerTable({server, world, type, player})}
  />}</>
};
