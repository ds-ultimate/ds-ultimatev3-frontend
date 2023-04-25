import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {WorldDisplayName} from "../../modelHelper/World";
import {useWorldData} from "../../apiInterface/loadContent";
import ConquerPage, {FILTER_OPTIONS} from "../layout/ConquerPage";
import {conquerChangeType, highlightRefType} from "../../modelHelper/Conquer";
import {worldConquerTable} from "../../apiInterface/apiConf";
import ErrorPage from "../layout/ErrorPage";
import React from "react";

const highlightPossible: conquerChangeType[] = [
  conquerChangeType.SELF,
  conquerChangeType.INTERNAL,
  conquerChangeType.BARBARIAN,
  //conquerChangeType.DELETION,
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

export default function WorldConquerPage() {
  const {server, world, type} = useParams()
  const {t} = useTranslation("ui")
  const [worldErr, worldData] = useWorldData(server, world)

  if(worldErr) return <ErrorPage error={worldErr} />

  let typeName: string
  if(type === "all") {
    typeName = t("conquer.all")
  } else {
    //TODO localized error messages see TODO in backend for ideas
    return <ErrorPage error={"conquererr"} />
  }

  const who = <>{worldData && <WorldDisplayName world={worldData} />}</>
  return <ConquerPage
      typeName={typeName}
      who={who}
      conquerSave={"worldConquer"}
      highlightPossible={highlightPossible}
      filterPossible={filterPossible}
      conquerTypeFilterPossible={conquerTypeFilterPossible}
      highlightRef={[highlightRefType.VILLAGE, 0]}
      api={worldConquerTable({server, world, type})}
  />
};
