import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React from "react";
import ErrorPage from "../../../layout/ErrorPage";
import {DecodeName} from "../../../../util/UtilFunctions";
import AllyChangePage, {FILTER_OPTIONS} from "../AllyChangePage";
import {playerAllyChangeTable} from "../../../../apiInterface/apiConf";
import {FrontendError} from "../../../layout/ErrorPages/ErrorTypes"
import {usePlayerData} from "../../../../apiInterface/loaders/player"

const filterPossible = [
  FILTER_OPTIONS.OLD_ALLY,
  FILTER_OPTIONS.NEW_ALLY,
]
export default function PlayerAllyChangePage() {
  const {server, world, type, player} = useParams()
  const {t} = useTranslation("ui")
  const [playerErr, playerData] = usePlayerData(server, world, player)

  if(playerErr) return <ErrorPage error={playerErr} />

  let reducedFilters: string[]
  let typeName: string
  if(type === "all") {
    typeName = t("allyChanges.all")
    reducedFilters = filterPossible.slice()
  } else {
    const errData: FrontendError = {
      isFrontend: true,
      code: 404,
      k: "404.unknownType",
      p: {type},
    }
    return <ErrorPage error={errData} />
  }

  const who = <>{<DecodeName name={playerData?.cur?.name ?? playerData?.top?.name ?? ""} />}</>
  return <>{player && <AllyChangePage
      typeName={typeName}
      who={who}
      allyChangeSave={"playerAllyChanges"}
      filterPossible={reducedFilters}
      api={playerAllyChangeTable({server, world, type, player})}
  />}</>
};
