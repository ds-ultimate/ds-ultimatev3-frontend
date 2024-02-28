import {
  calculateSendTime,
  CommandList,
  CommandListItem,
  commandPlannerUnitName, NewCommandListItem,
  useTypeIDToName
} from "../../../../modelHelper/Tool/CommandList"
import {useTranslation} from "react-i18next"
import {Button, Form, FormControl, InputGroup, Row} from "react-bootstrap"
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react"
import {
  dateFormatLocal_DMY_HMS,
  dateFormatYMD_HMS,
  useCopyWithToast
} from "../../../../util/UtilFunctions"
import {exportTroopArmyAmount, parseTroopArmyAmount} from "../../../../util/dsHelpers/TroopHelper"
import ReactBootstrapAccordion from "../../../../util/ReactBootstrapAccordion"
import {get_icon} from "../../../../util/dsHelpers/Icon"
import {useVillageOwnerBB, villageCoordinateBB, villagePureType} from "../../../../modelHelper/Village"
import {
  getAllPlayers,
  getAllVillages,
} from "../../../../apiInterface/worldDataAPI"
import {worldType, worldUnitType} from "../../../../modelHelper/World"
import {BASE_PATH, formatRoute} from "../../../../util/router"
import {INDEX} from "../../../routes"
import LoadingScreen, {LoadingScreenContext} from "../../../layout/LoadingScreen"
import {useCreateToast} from "../../../layout/ToastHandler"
import {StateUpdater} from "../../../../util/customTypes"
import {usePerformImport} from "../../../../modelHelper/Tool/CommandListAPIHelper"
import {playerPureType} from "../../../../modelHelper/Player"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCopy} from "@fortawesome/free-solid-svg-icons"


const EXPORT_MAX_BRACKETS = 1000

export default function CommandImportTab({world, worldUnit, list, updateList}: {world: worldType,
    worldUnit: worldUnitType, list: CommandList, updateList: StateUpdater<CommandList>}) {
  const { t } = useTranslation("tool")
  const templatedExporter = useTemplatedExporter()

  const {wbExportCb, bbExportCb, igmExportCb} = useMemo(() => {
    const wbExportCb = () => wbExporter(list)
    const bbExportCb = () => templatedExporter(world, list, t("commandPlanner.overview.import.templateBB_body"), t("commandPlanner.overview.import.templateBB_row"))
    const igmExportCb = () => templatedExporter(world, list, t("commandPlanner.overview.import.templateIGM_body"), t("commandPlanner.overview.import.templateIGM_row"))
    return {wbExportCb, bbExportCb, igmExportCb}
  }, [t, templatedExporter, world, list])

  return (
      <Row>
        <ReactBootstrapAccordion
            items={[
              {title: t("commandPlanner.overview.import.exportWB"), key: "exp_wb",
                element: <ExportElement dataCb={wbExportCb} description={t("commandPlanner.overview.import.exportWBDesc")} />},
              {title: t("commandPlanner.overview.import.exportBB"), key: "exp_bb",
                element: <ExportElement dataCb={bbExportCb} description={t("commandPlanner.overview.import.exportBBDesc")} />},
              {title: t("commandPlanner.overview.import.exportIGM"), key: "exp_igm",
                element: <ExportElement dataCb={igmExportCb} description={t("commandPlanner.overview.import.exportIGMDesc")} />},
              {title: t("commandPlanner.overview.import.importWB"), key: "imp_wb",
                element: <ImportWBElement list={list} updateList={updateList} worldUnit={worldUnit} world={world} />},
            ]}
        />
      </Row>
  )
}

function ExportElement({dataCb, description}: {dataCb: () => string[] | Promise<string[]>, description: string | null}) {
  return (
      <LoadingScreen darken>
        <ExportElementInternal dataCb={dataCb} description={description} />
      </LoadingScreen>
  )
}

function ExportElementInternal({dataCb, description}: {dataCb: () => string[] | Promise<string[]>, description: string | null}) {
  const [data, updateData] = useState<string[]>([""])
  const setLoading = useContext(LoadingScreenContext)
  const { t } = useTranslation("tool")

  useEffect(() => {
    setLoading(true, "export")
    new Promise<string[]>(resolve => resolve(dataCb()))
        .then(d => {
          setLoading(false, "export")
          updateData(d)
        }).catch(err => console.log(err))
  }, [dataCb, setLoading])

  return (
      <>
        {description}<br />
        {data.length > 1 && t("commandPlanner.overview.import.maxBracket", {amount: EXPORT_MAX_BRACKETS})}
        {data.map((d, idx) => <ShowElement d={d} desc={description} key={idx} isSingle={data.length === 1}/>)}
      </>
  )
}

function ShowElement({d, desc, isSingle}: {d: string, desc: string | null, isSingle: boolean}) {
  const { t } = useTranslation("tool")
  const copyWithToast = useCopyWithToast()

  if(isSingle) {
    return (
        <div className={"mb-3"}>
          <FormControl as={"textarea"} disabled style={{height: "250px"}} value={d} />
          <div className={"mt-2"}>
            <Button variant={"primary"} onClick={() => copyWithToast(d)}>{t("copy")}</Button>
            <span className={"ms-2"}>{desc}</span>
          </div>
        </div>
    )
  } else {
    return (
        <InputGroup className={"mt-2"}>
          <Form.Control value={d} readOnly />
          <Button onClick={() => copyWithToast(d)}><FontAwesomeIcon icon={faCopy} /></Button>
        </InputGroup>
    )
  }
}

function useTemplatedExporter() {
  const { t } = useTranslation("tool")
  const villageOwnerBB = useVillageOwnerBB()
  const typeIdToName = useTypeIDToName()
  const allVillagesDict = useCallback(async (world: worldType) => {
    const result: Map<number, villagePureType> = new Map()
    const allVillages = await getAllVillages(world)
    allVillages.forEach(v => result.set(v.villageID, v))
    return result
  }, [])

  const allPlayersDict = useCallback(async (world: worldType) => {
    const result: Map<number, playerPureType> = new Map()
    const allPlayers = await getAllPlayers(world)
    if(allPlayers === undefined) return result
    allPlayers.forEach(p => result.set(p.playerID, p))
    return result
  }, [])

  return useCallback(async (world: worldType, list: CommandList, bodyTemplate: string, rowTemplate: string) => {
    const worldURL = world.url + "/game.php?"
    const vilDict = await allVillagesDict(world)
    const playerDict = await allPlayersDict(world)

    const bodyNoRow = bodyTemplate
        .replaceAll("%TITLE%", (list.title!==null?list.title:t("commandPlanner.overview.noTitle")))
        .replaceAll("%ELEMENT_COUNT%", ""+list.items.length)
        .replaceAll("%CREATE_AT%", dateFormatLocal_DMY_HMS(new Date()))
        .replaceAll("%CREATE_WITHL%", BASE_PATH + formatRoute(INDEX, {}))
        .replaceAll("%CREATE_WITH%", "DS-Ultimate")
    const bodyBrackets = bracketCounter(bodyNoRow)

    let sumBrackets = bodyBrackets
    const resultArray: string[] = []
    let allRows = ""
    for(let idx = 0; idx < list.items.length; idx++) {
      const item = list.items[idx]
      const start_village = vilDict.get(item.startVillageId)
      const target_village = vilDict.get(item.targetVillageId)
      const startDate = new Date(item.sendTimestamp)
      const arrDate = new Date(item.arriveTimestamp)
      const uvURL = (list.uvMode?`t=${start_village?.owner}&`:"")
      const troopUrl = item.troops.map(([uName, cnt]) => `&${uName}=${cnt}`).reduce((prev, cur) => prev+cur, "")
      const placeURL = worldURL + uvURL + `village=${item.startVillageId}&screen=place&target=${item.targetVillageId}` + troopUrl
      const result = rowTemplate
          .replaceAll("%ELEMENT_ID%", ""+(idx+1))
          .replaceAll("%TYPE%", typeIdToName(item.type) ?? "")
          .replaceAll("%TYPE_IMG%", "[img]" + get_icon(item.type) + "[/img]")
          .replaceAll("%UNIT%", "[unit]" + commandPlannerUnitName[item.unit] + "[/unit]")
          .replaceAll("%SOURCE%", (start_village !== undefined?villageCoordinateBB(start_village):'???'))
          .replaceAll("%TARGET%", (target_village !== undefined?villageCoordinateBB(target_village):'???'))
          .replaceAll("%ATTACKER%", villageOwnerBB(playerDict, start_village))
          .replaceAll("%DEFENDER%", villageOwnerBB(playerDict, target_village))
          .replaceAll("%SEND%", dateFormatYMD_HMS(startDate) + ":" + startDate.getMilliseconds())
          .replaceAll("%ARRIVE%", dateFormatYMD_HMS(arrDate) + ":" + arrDate.getMilliseconds())
          //type id 37 equals place -> easy way to access that translation
          .replaceAll("%PLACE%", "[url=\"" + placeURL + "\"]" + typeIdToName(37) + "[/url]")
      const rowBrackets = bracketCounter(rowTemplate)
      if(sumBrackets+rowBrackets > EXPORT_MAX_BRACKETS) {
        resultArray.push(bodyNoRow.replaceAll("%ROW%", allRows))
        allRows = ""
        sumBrackets = bodyBrackets
      }
      allRows += result
      sumBrackets+= rowBrackets
    }
    resultArray.push(bodyNoRow.replaceAll("%ROW%", allRows))

    return resultArray
  }, [t, typeIdToName, allVillagesDict, allPlayersDict, villageOwnerBB])
}

function wbExporter(list: CommandList) {
  const res = list.items.reduce((prev, cur) => prev + exportSingleWB(cur) + "\n", "")
  return [res]
}

function exportSingleWB(item: CommandListItem) {
  return `${item.startVillageId}&${item.targetVillageId}&${commandPlannerUnitName[item.unit]}&${item.arriveTimestamp}&` +
      `${item.type}&false&${item.sent}&${exportTroopArmyAmount(item.troops)}`
}

function ImportWBElement({world, worldUnit, list, updateList}: {world: worldType, worldUnit: worldUnitType,
    list: CommandList, updateList: StateUpdater<CommandList>}) {
  const { t } = useTranslation("tool")
  const [importData, setImportData] = useState<string>("")
  const createToast = useCreateToast()
  const importerAPI = usePerformImport()

  const performImport = useCallback(() => {
    Promise.all(importData.split("\n")
        .map(line => {
          if(line === "") return true
          const splitted = line.split("&")
          if(splitted.length < 7) {
            return false
          }
          const startVillageId = +splitted[0]
          const targetVillageId = +splitted[1]
          const unit = commandPlannerUnitName.findIndex(v => v === splitted[2])
          const arriveTimestamp = +splitted[3]
          const type = +splitted[4]
          const sent = splitted[6] === "true"
          const troops = splitted.length>7?parseTroopArmyAmount(splitted[7]):[]
          const command = {
            type, startVillageId, targetVillageId, unit, sent, troops, arriveTimestamp,
            tribeBoost: 0, supportBoost: 0
          }
          return calculateSendTime(command, world, worldUnit)
        }))
        .then(mappedCommands => {
          if(mappedCommands.includes(false)) {
            createToast(t("commandPlanner.overview.import.failed"), t("commandPlanner.overview.import.wbImportWrongData"))
          }

          const imported = mappedCommands.filter(v => v !== false && v !== true) as NewCommandListItem[]
          importerAPI(list, updateList, imported)
              .then(() => {
                createToast(t("commandPlanner.overview.import.successTitle"),
                    t("commandPlanner.overview.import.wbImportSuccess", {count: imported.length}))
              })
        })
  }, [t, createToast, importData, importerAPI, list, updateList, world, worldUnit])

  return (
      <>
        <FormControl as={"textarea"} style={{height: "250px"}} value={importData} onChange={e => setImportData(e.target.value)}/>
        <div className={"mt-2"}>
          <Button variant={"success"} onClick={performImport}>{t("commandPlanner.overview.import.import")}</Button>
          <span className={"ms-2"}>{t("commandPlanner.overview.import.importWBDesc")}</span>
        </div>
      </>
  )
}

function bracketCounter(data: string) {
  let cnt = 0
  for(let i = 0; i < data.length; i++) {
    if(data.charAt(i) === "[") cnt++
  }
  return cnt
}
