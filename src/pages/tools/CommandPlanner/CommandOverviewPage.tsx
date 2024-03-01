import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useExtendedWorldData, useWorldData} from "../../../apiInterface/loaders/world"
import {useTranslation} from "react-i18next";
import ErrorPage from "../../layout/ErrorPage";
import {
  WorldDisplayName,
  worldDisplayNameRaw,
  worldType, worldUnitType
} from "../../../modelHelper/World"
import {Card, Col, Row} from "react-bootstrap"
import {FrontendError} from "../../layout/ErrorPages/ErrorTypes"
import LoadingScreen from "../../layout/LoadingScreen"
import ReactBootstrapTabs from "../../../util/ReactBootstrapTabs"
import CommandCreateTab from "./CommandOverviewPageTabs/CommandCreateTab"
import {CommandList, NewCommandListItem} from "../../../modelHelper/Tool/CommandList"
import {worldConfigType} from "../../../modelHelper/WorldConfig"
import CommandLinkTab from "./CommandOverviewPageTabs/CommandLinkTab"
import CommandImportTab from "./CommandOverviewPageTabs/CommandImportTab"
import {usePerformInitialImport} from "../../../modelHelper/Tool/CommandListAPIHelper"
import CommandStatsTab from "./CommandOverviewPageTabs/CommandStatsTab"
import {CommandTable} from "./CommandOverviewPageTabs/CommandTable"


export enum CommandPlannerMode {
  VIEW,
  EDIT,
}

export default function CommandOverviewPage() {
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const [worldExtendedErr, worldDataExtended] = useExtendedWorldData(server, world)
  const [tUi]  = useTranslation("ui")
  const { t } = useTranslation("tool")

  useEffect(() => {
    if(worldData !== undefined) {
      document.title = worldDisplayNameRaw(tUi, worldData) + ": " + t("commandPlanner.overview.title")
    }
  }, [tUi, worldData, t])

  if(worldErr) return <ErrorPage error={worldErr} />
  if(worldExtendedErr) return <ErrorPage error={worldExtendedErr} />

  let worldConf = worldDataExtended?.config
  let worldUnit = worldDataExtended?.units
  if(worldConf === null || worldUnit === null) {
    const errData: FrontendError = {
      isFrontend: true,
      code: 404,
      k: "404.worldNotSupported",
      p: {},
    }
    return <ErrorPage error={errData} />
  }

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-none d-lg-block"}>
            {/* TODO other attack plans after auth
            <div class="col-2 position-absolute dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="ownedPlanners" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{ __('tool.attackPlanner.fastSwitch') }}
                </button>
                <div class="dropdown-menu" aria-labelledby="ownedPlanners">
                    @foreach($ownPlanners as $planner)
                        <a class="dropdown-item" href="{{
                            route('tools.attackPlannerMode', [$planner->id, 'edit', $planner->edit_key])
                            }}">{{ $planner->getTitle().' ['.$planner->world->getDisplayName().']' }}</a>
                    @endforeach
                </div>
            </div>
            */}
            <h1 className={"fw-normal"}>
              {t("commandPlanner.overview.title") + " "}
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h1>
          </Col>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-lg-none"}>
            <h1 className={"fw-normal"}>
              {t("commandPlanner.overview.title") + " "}
            </h1>
            <h4>
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h4>
          </Col>
        </Col>
        <LoadingScreen>
          {worldConf && worldUnit && <CommandOverviewMain worldData={worldData} worldConf={worldConf} worldUnit={worldUnit} />}
        </LoadingScreen>
      </Row>
  )
}

function CommandOverviewMain({worldData, worldConf, worldUnit}: {worldData?: worldType, worldConf: worldConfigType, worldUnit: worldUnitType}) {
  const {id, mode, key} = useParams()
  const { t } = useTranslation("tool")

  const [list, updateList] = useState<CommandList>({
    title: null, world_id: 6269, id: 123,
    edit_key: "mmgt9sl1CrsLN5hv1e0CXt5tFZBSPDs7jxPvQhap",
    show_key: "AoV6rWY6tWUHtXJhqCnyvC65GOOTigWZa5EIr1b0",
    uvMode: false,
    items: [],
  })
  const modeEnum = mode === "edit"?CommandPlannerMode.EDIT:CommandPlannerMode.VIEW

  const performImport = usePerformInitialImport()
  const [initialLoadingDone, setInitialLoadingDone] = useState<boolean>(false)

  useEffect(() => {
    if(!initialLoadingDone) {
      setInitialLoadingDone(true)
      const newCmds: NewCommandListItem[] = [
        {startVillageId: 1727, targetVillageId: 6138, type: 8, arriveTimestamp: 1708015062000, troops: [
            ["spear", 200], ["axe", 300], ["light", 300],
          ], unit: 2, sent: false, tribeBoost: 0, supportBoost: 0, sendTimestamp: 1708015062000},
        {startVillageId: 2653, targetVillageId: 6677, type: 8, arriveTimestamp: 1708015062000, troops: [
            ["sword", 200], ["spy", 300], ["heavy", 300],
          ], unit: 2, sent: true, tribeBoost: 0, supportBoost: 0, sendTimestamp: 1708015062000},
        {startVillageId: 2658, targetVillageId: 7249, type: 8, arriveTimestamp: 1708015062000, troops: [
            ["spear", 200], ["axe", 300], ["light", 300],
          ], unit: 2, sent: false, tribeBoost: 0, supportBoost: 0, sendTimestamp: 1708015062000},
        {startVillageId: 2735, targetVillageId: 7445, type: 8, arriveTimestamp: 1708015062000, troops: [
            ["sword", 200], ["spy", 300], ["heavy", 300],
          ], unit: 2, sent: false, tribeBoost: 0, supportBoost: 0, sendTimestamp: 1708015062000},
        {startVillageId: 5725, targetVillageId: 7703, type: 8, arriveTimestamp: 1708015062000, troops: [
            ["spear", 200], ["axe", 300], ["light", 300],
          ], unit: 2, sent: true, tribeBoost: 0, supportBoost: 0, sendTimestamp: 1708015062000},
      ]
      performImport(list, updateList, newCmds)
    }
  }, [initialLoadingDone, setInitialLoadingDone, performImport, list, updateList]);

  return (
      <>
      {modeEnum === CommandPlannerMode.EDIT && <Col xs={12} className={"mt-2 d-print-none"}>
          {list.title === null && <Card className={"mb-2 p-3"}>
            {t("commandPlanner.overview.withoutTitle")}
          </Card>}
          <Card>
            <Card.Body>
              <ReactBootstrapTabs defaultKey={"create"} items={[
                {key: "create", title: t("commandPlanner.overview.tabs.create"),
                  element: worldData && <CommandCreateTab list={list} updateList={updateList} worldData={worldData} worldConf={worldConf} worldUnitConf={worldUnit}/>},
                {key: "multiedit", title: t("commandPlanner.overview.tabs.multiedit"),
                  element: <UselessElement d={"MULTI_EDIT"} />},
                {key: "link", title: t("commandPlanner.overview.tabs.link"),
                  element: <CommandLinkTab list={list} />},
                {key: "import", title: t("commandPlanner.overview.tabs.import"),
                  element: worldData && <CommandImportTab world={worldData} worldUnit={worldUnit} list={list} updateList={updateList} />},
                {key: "stats", title: t("commandPlanner.overview.tabs.stats"),
                  element: <CommandStatsTab list={list} />},
                {key: "tips", title: t("commandPlanner.overview.tabs.tips"),
                  element: <UselessElement d={"TIPS"} />},
              ]} />
            </Card.Body>
          </Card>
        </Col>}
        <Col xs={12} className={"mt-2"}>
          <Card className={"mb-2 p-3 d-print-none"}>
            <b>{t("commandPlanner.overview.warnSending")}</b>
          </Card>
          {worldData && <CommandTable world={worldData} list={list} updateList={updateList} mode={modeEnum} />}
        </Col>
      </>
  )
}

function UselessElement({d}: {d: string}) {
  console.log("Rendering", d)
  return <>{d}</>
}
