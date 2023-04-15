import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {WorldDisplayName} from "../../modelHelper/World";
import {useWorldData} from "../../apiInterface/loadContent";
import ConquerPage, {FILTER_OPTIONS} from "../layout/ConquerPage";
import {conquerChangeType} from "../../modelHelper/Conquer";
import {worldConquerTable} from "../../apiInterface/apiConf";

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
  const worldData = useWorldData(server, world)

  let typeName: string
  if(type === "all") {
    typeName = t("conquer.all")
  } else {
    //TODO 404 here
    return <>404</>
  }

  const who = <>{worldData && <WorldDisplayName world={worldData} />}</>
  return <ConquerPage
      typeName={typeName}
      who={who}
      conquerSave={"worldConquer"}
      highlightPossible={highlightPossible}
      filterPossible={filterPossible}
      conquerTypeFilterPossible={conquerTypeFilterPossible}
      api={worldConquerTable({server, world, type})}
  />
};
