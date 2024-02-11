import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React from "react";
import {conquerChangeType, highlightRefType} from "../../../../modelHelper/Conquer";
import ConquerPage, {FILTER_OPTIONS} from "../../../layout/ConquerPage";
import ErrorPage from "../../../layout/ErrorPage";
import {villageConquerTable} from "../../../../apiInterface/apiConf";
import {rawDecodeName} from "../../../../util/UtilFunctions";
import {FrontendError} from "../../../layout/ErrorPages/ErrorTypes"
import {useVillageData} from "../../../../apiInterface/loaders/village"

const highlightPossible: conquerChangeType[] = [
  conquerChangeType.SELF,
  conquerChangeType.INTERNAL,
  conquerChangeType.BARBARIAN,
  //conquerChangeType.DELETION,
]

const filterPossible = [
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

export default function VillageConquerPage() {
  const {server, world, type, village} = useParams()
  const {t} = useTranslation("ui")
  const [villageErr, villageData] = useVillageData(server, world, village)

  if(villageErr) return <ErrorPage error={villageErr} />

  let typeName: string
  if(type === "all") {
    typeName = t("conquer.all")
  } else {
    const errData: FrontendError = {
      isFrontend: true,
      code: 404,
      k: "404.unknownType",
      p: {type},
    }
    return <ErrorPage error={errData} />
  }

  const who = villageData?.data?rawDecodeName(villageData.data.name):undefined
  return <>{village && <ConquerPage
      typeName={typeName}
      who={who}
      conquerSave={"villageConquer"}
      highlightPossible={highlightPossible}
      highlightRef={[highlightRefType.VILLAGE, +village]}
      filterPossible={filterPossible}
      conquerTypeFilterPossible={conquerTypeFilterPossible}
      api={villageConquerTable({server, world, type, village})}
  />}</>
};
