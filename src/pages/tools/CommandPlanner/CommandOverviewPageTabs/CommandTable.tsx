import {
  CommandList,
  CommandListItem,
  CommandListSound,
  commandPlannerUnitName, getCommandListSoundAsset, useCommandListSoundTranslations,
  useTypeIDToName
} from "../../../../modelHelper/Tool/CommandList"
import {useTranslation} from "react-i18next"
import {Button, Card, Col, Form, InputGroup, Modal, Tooltip} from "react-bootstrap"
import DatatableBase, {DATATABLE_VARIANT, SORTING_DIRECTION} from "../../../../util/datatables/DatatableBase"
import {StateUpdater} from "../../../../util/customTypes"
import DatatableHeaderBuilder from "../../../../util/datatables/DatatableHeaderBuilder"
import React, {ChangeEvent, useCallback, useEffect, useMemo, useReducer, useState} from "react"
import {useAllPlayers, useAllVillages} from "../../../../apiInterface/worldDataAPI"
import {worldType} from "../../../../modelHelper/World"
import {villageCoordinates, villagePureType} from "../../../../modelHelper/Village"
import {CommandPlannerMode} from "../CommandOverviewPage"
import {LinkPlayerGeneric, playerPureType, useSpecialPlayerTranslations} from "../../../../modelHelper/Player"
import ErrorPage from "../../../layout/ErrorPage"
import {CustomTooltip, dateFormatLocal_DMY_HMS, DecodeName, rawDecodeName} from "../../../../util/UtilFunctions"
import {get_icon, getUnitIcon} from "../../../../util/dsHelpers/Icon"
import {useSetUVMode} from "../../../../modelHelper/Tool/CommandListAPIHelper"
import {useCreateToast} from "../../../layout/ToastHandler"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faGear, faPlay, faVolumeMute, faVolumeUp} from "@fortawesome/free-solid-svg-icons"
import usePersistentState from "../../../../util/persitentState"
import BSModal from "../../../../util/BSModal"
import {useTemplatedRowExporter} from "./CommandImportTab"
import {Link} from "react-router-dom"
import {formatRoute} from "../../../../util/router"
import {VILLAGE_INFO} from "../../../routes"


type SettingsType = {
  audioDelay: number,
  audioType: CommandListSound,
  audioVolume: number,
  audioMuted: boolean,
  sendNotifications: boolean
}

const defaultSettings: SettingsType = {
  audioDelay: 60,
  audioType: CommandListSound.SIREN,
  audioVolume: 0.2,
  audioMuted: false,
  sendNotifications: false,
}

export function CommandTable({world, list, updateList, mode}: {world: worldType, list: CommandList, updateList: StateUpdater<CommandList>, mode: CommandPlannerMode}) {
  const [settings, setSettings] = usePersistentState<SettingsType>("commandPlanner.overview.table.settings", defaultSettings)
  const { t } = useTranslation("tool")

  const [allVillageErr, allVillages] = useAllVillages(world)
  const allVillagesDict = useMemo(() => {
    const result: Map<number, villagePureType> = new Map()
    if(allVillages === undefined) return result
    allVillages.forEach(v => result.set(v.villageID, v))
    return result
  }, [allVillages])

  const [allPlayerErr, allPlayers] = useAllPlayers(world)
  const allPlayersDict = useMemo(() => {
    const result: Map<number, playerPureType> = new Map()
    if(allPlayers === undefined) return result
    allPlayers.forEach(p => result.set(p.playerID, p))
    return result
  }, [allPlayers])

  const commandListHeader = useCommandListHeader(allVillagesDict, mode)
  const VillageLink = useVillageLink(world, allVillagesDict)
  const PlayerLink = useVillagePlayerLink(world, allVillagesDict, allPlayersDict)
  const typeIdToName = useTypeIDToName()
  const searchCommandList = useSearchCBCommandListItem(allPlayersDict, allVillagesDict)

  const [[audioElm, audioType], setAudio] = useState<[HTMLAudioElement | undefined, number]>([undefined, -1])

  useEffect(() => {
    if(audioType !== settings.audioType) {
      setAudio([new Audio(getCommandListSoundAsset(settings.audioType)), settings.audioType])
    }
  }, [audioType, settings.audioType])

  useEffect(() => {
    if(audioElm) {
      audioElm.volume = settings.audioVolume
    }
  }, [audioElm, settings.audioVolume]);

  const exporter = useTemplatedRowExporter()

  const playSound = useCallback((item?: CommandListItem, sendNotification?: boolean, playSound?: boolean) => {
    if((sendNotification === true || sendNotification === undefined) && settings.sendNotifications) {
      if(item === undefined) {
        new Notification(t("commandPlanner.overview.table.notificationItWorks"))
      } else {
        exporter(world, item, t("commandPlanner.overview.table.notificationExport"), allVillagesDict, allPlayersDict, false, 0)
            .then(text => {
              new Notification(text)
            })
      }
    }
    if((playSound === true || playSound === undefined) && audioElm) {
      audioElm.play()
    }
  }, [settings, audioElm, t, allVillagesDict, allPlayersDict, exporter, world])

  if(allVillageErr) return <ErrorPage error={allVillageErr} />
  if(allPlayerErr) return <ErrorPage error={allPlayerErr} />

  return (
      <Card>
        <Card.Body>
          <DatatableBase<CommandListItem>
              header={commandListHeader}
              variant={DATATABLE_VARIANT.DATA}
              saveAs={"CommandOverview"}
              cells={[
                () => "SEL",
                (c) => <VillageLink id={c.startVillageId} />,
                (c) => <PlayerLink id={c.startVillageId} />,
                (c) => <VillageLink id={c.targetVillageId} />,
                (c) => <PlayerLink id={c.targetVillageId} />,
                (c) => <TooltipIcon src={getUnitIcon(commandPlannerUnitName[c.unit])} tooltip={typeIdToName(c.unit)} />,
                (c) => <TooltipIcon src={get_icon(c.type)} tooltip={typeIdToName(c.type)} />,
                (c) => dateFormatLocal_DMY_HMS(new Date(c.sendTimestamp)),
                (c) => dateFormatLocal_DMY_HMS(new Date(c.arriveTimestamp)),
                (c) => <TimeDiff date={c.sendTimestamp} playSound={playSound} item={c} soundDelay={settings.audioDelay} />,
                () => "info",
                () => "action",
                () => "delete",
              ]}
              keyGen={data => data.id}
              searching={searchCommandList}
              data={list.items}
              defaultSort={[7, SORTING_DIRECTION.ASC]}
              responsiveTable
              striped
              topBarEnd={<>
                <CommandTableUVConfig list={list} updateList={updateList} />
                <CommandTableSettings cur={settings} upd={setSettings} playSound={playSound} />
              </>}
              limits={[10, 20, 50, 100, 1000]}
          />
        </Card.Body>
      </Card>
  )
}

function useCommandListHeader(allVillages: Map<number, villagePureType>, mode: CommandPlannerMode) {
  const { t } = useTranslation("tool")
  return useMemo(() => {
    return new DatatableHeaderBuilder<CommandListItem>()
        .addMainRow(row => {
          row.addCell({title: ""})
          row.addCell({title: t('commandPlanner.overview.prop.startVillage'),
            sortCB: (data1, data2) => data1.startVillageId - data2.startVillageId})
          row.addCell({title: t('commandPlanner.overview.table.attacker'),
            sortCB: (data1, data2) => {
              const owner1 = allVillages.get(data1.startVillageId)?.owner ?? -1
              const owner2 = allVillages.get(data2.startVillageId)?.owner ?? -1
              return owner1 - owner2
            }})
          row.addCell({title: t('commandPlanner.overview.prop.targetVillage'),
            sortCB: (data1, data2) => data1.targetVillageId - data2.targetVillageId})
          row.addCell({title: t('commandPlanner.overview.table.defender'),
            sortCB: (data1, data2) => {
              const owner1 = allVillages.get(data1.targetVillageId)?.owner ?? -1
              const owner2 = allVillages.get(data2.targetVillageId)?.owner ?? -1
              return owner1 - owner2
            }})
          row.addCell({title: t('commandPlanner.overview.prop.unit'),
            sortCB: (data1, data2) => data1.unit - data2.unit})
          row.addCell({title: t('commandPlanner.overview.prop.type'),
            sortCB: (data1, data2) => data1.type - data2.type})
          row.addCell({title: t('commandPlanner.overview.prop.sendTime'),
            sortCB: (data1, data2) => data1.sendTimestamp - data2.sendTimestamp})
          row.addCell({title: t('commandPlanner.overview.prop.arrivalTime'),
            sortCB: (data1, data2) => data1.arriveTimestamp - data2.arriveTimestamp})
          row.addCell({title: t('commandPlanner.overview.table.countdown'),
            sortCB: (data1, data2) => data1.sendTimestamp - data2.sendTimestamp})
          row.addCell({title: ""})
          row.addCell({title: ""})
          if(mode === CommandPlannerMode.EDIT) {
            row.addCell({title: ""})
          }
        })
  }, [t, mode, allVillages])
}

function useVillageLink(world: worldType, allVillageDict: Map<number, villagePureType>) {
  const { t } = useTranslation("tool")

  return useCallback(({id}: {id: number}) => {
    const village = allVillageDict.get(id)
    if(village === undefined) {
      return <>{t("commandPlanner.overview.table.villageNotExist")}</>
    }
    return (
        <Link to={formatRoute(VILLAGE_INFO, {server: world.server__code, world: world.name, village: (village.villageID + "")})}>
          [{villageCoordinates(village)}] <DecodeName name={village.name} />
        </Link>
    )
  }, [t, world, allVillageDict])
}

function useVillagePlayerLink(world: worldType, allVillageDict: Map<number, villagePureType>, allPlayerDict: Map<number, playerPureType>) {
  return useCallback(({id}: {id: number}) => {
    const village = allVillageDict.get(id)
    if(village === undefined) {
      // village deleted -> owner -1 will show deleted
      return <LinkPlayerGeneric world={world} owner={-1} owner_name={null} />
    }
    const player = allPlayerDict.get(village.owner)
    if(player === undefined) {
      // player deleted or barbarian -> owner 0 will show barb everything else will show deleted
      return <LinkPlayerGeneric world={world} owner={village.owner} owner_name={null} />
    }

    return <LinkPlayerGeneric world={world} owner={village.owner} owner_name={player.name} />
  }, [world, allVillageDict, allPlayerDict])
}

function TooltipIcon({src, tooltip}: {src: string, tooltip: string | undefined}) {
  return <CustomTooltip overlay={<Tooltip>{tooltip}</Tooltip>}>
    <img src={src} alt={tooltip ?? ""} />
  </CustomTooltip>
}

function TimeDiff({date, playSound, item, soundDelay}: {date: number,
    playSound: (item?:CommandListItem, notify?: boolean, sound?: boolean) => void, item: CommandListItem, soundDelay: number}) {
  const [timeLeft, setTimeLeft] = useState<number>(date - (new Date()).getTime());
  const [soundPlayed, setSoundPlayed] = useState<boolean>(date - (new Date()).getTime() < soundDelay * 1000)

  useEffect(() => {
    //only start counting if there is some time left on the countdown
    if(date - (new Date()).getTime() < 0) {
      return
    }

    const timer = setInterval(() => {
      const diff = date - (new Date()).getTime()
      if(diff < soundDelay * 1000 && !soundPlayed) {
        setSoundPlayed(true)
        playSound(item, true, true)
      }
      if(diff < 0) {
        clearInterval(timer)
      }
      setTimeLeft(diff);
    }, 1000);

    return () => clearInterval(timer)
  }, [date, soundPlayed, setSoundPlayed, setTimeLeft, playSound, item, soundDelay]);

  const reducedTimeLeft = Math.round(Math.max(timeLeft, 0) / 1000)
  const s = reducedTimeLeft % 60
  const minutesLeft = ((reducedTimeLeft - s)/60)
  const m = minutesLeft % 60
  const hoursLeft = ((minutesLeft - m)/60)
  const h = hoursLeft % 24
  const d = (hoursLeft - h) / 24

  return <>{d>0?d+":":""}{h<10?"0"+h:h}:{m<10?"0"+m:m}:{s<10?"0"+s:s}</>
}

function CommandTableUVConfig({list, updateList}: {list: CommandList, updateList: StateUpdater<CommandList>}) {
  const { t } = useTranslation("tool")
  const setUVMode = useSetUVMode()
  const createToast = useCreateToast()

  const toggleUVMode = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setUVMode(list, updateList, event.target.checked)
        .then(() => {
          createToast(t("commandPlanner.overview.create.createSuccessTitle"), t("commandPlanner.overview.table.uvUpdateSuccessDesc"))
        })

  }, [list, updateList, setUVMode, createToast, t])
  return (
      <Col xs={"auto"}>
        <CustomTooltip overlay={<Tooltip>{t("commandPlanner.overview.table.uvModeDesc")}</Tooltip>}>
          <div className={"h-100 d-flex flex-column justify-content-center "}>
            <Form.Check id="command-check-uv" checked={list.uvMode} onChange={toggleUVMode}
                        label={t("commandPlanner.overview.table.uvMode")}/>
          </div>
        </CustomTooltip>
      </Col>
  )
}

function CommandTableSettings({cur, upd, playSound}: {
  cur: SettingsType,
  upd: StateUpdater<SettingsType>,
  playSound: (item?:CommandListItem, notify?: boolean, sound?: boolean) => void
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ignored, forceUpdate] = useReducer(x => x + 1, 0)

  const [open, setOpen] = useState<boolean>(false)
  const { t } = useTranslation("tool")
  const soundTranslations = useCommandListSoundTranslations()
  const [tmpSoundDelay, setTmpSoundDelay] = useState<number>(cur.audioDelay)

  useEffect(() => {
    setTmpSoundDelay(cur.audioDelay)
  }, [cur.audioDelay]);

  const eventForceSound = useCallback(() => {
    playSound(undefined, false)
  }, [playSound])

  const requestPermissions = useCallback(() => {
    Notification.requestPermission().then(() => {
      forceUpdate()
    })
  }, [forceUpdate])

  const notificationsSupported = "Notification" in window
  const notificationsAllowed = notificationsSupported && Notification.permission === "granted"

  const changeNotificationState = useCallback((newVal: boolean) => {
    upd(old => ({...old, sendNotifications: newVal}))
  }, [upd])

  const onHide = useCallback(() => {
    upd(old => ({...old, audioDelay: tmpSoundDelay}))
    setOpen(false)
  }, [upd, tmpSoundDelay, setOpen])

  return (
      <Col xs={"auto"}>
        <Button onClick={() => setOpen(true)}><FontAwesomeIcon icon={faGear} /></Button>
        <BSModal show={open} onHide={onHide} centered size={"xl"}>
          <Modal.Header closeButton>
            <Modal.Title>{t("commandPlanner.overview.table.settings.title")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <InputGroup className={"mb-3"}>
              <InputGroup.Text>{(t("commandPlanner.overview.table.settings.audioTiming") ?? "").replaceAll("%S%", "" + tmpSoundDelay)}</InputGroup.Text>
              <InputGroup.Text className={"flex-grow-1"}>
                <Form.Range value={tmpSoundDelay} min={0} max={300} onChange={e => setTmpSoundDelay(+e.target.value)}/>
              </InputGroup.Text>
            </InputGroup>
            <InputGroup className={"mb-3"}>
              <InputGroup.Text>{t("commandPlanner.overview.table.settings.audioType")}</InputGroup.Text>
              <Form.Select className={"bootstrap-select-custom"} onChange={e => upd(old => ({...old, audioType: +e.target.value}))} value={cur.audioType}>
                {soundTranslations.map(([sound, trans]) => (
                    <option key={sound} value={sound}>{trans}</option>
                ))
                }
              </Form.Select>
              <Button onClick={eventForceSound}><FontAwesomeIcon icon={faPlay} /></Button>
            </InputGroup>
            <InputGroup className={"mb-3"}>
              <InputGroup.Text>{t("commandPlanner.overview.table.settings.audioVolume")}</InputGroup.Text>
              <InputGroup.Text>{Math.round(cur.audioVolume*100)} %</InputGroup.Text>
              <InputGroup.Text className={"flex-grow-1"}>
                <Form.Range value={cur.audioVolume} min={0} max={1} step={0.01} onChange={e => upd(old => ({...old, audioVolume: +e.target.value}))}/>
              </InputGroup.Text>
              <Button onClick={() => upd(old => ({...old, audioMuted: !old.audioMuted}))}><FontAwesomeIcon icon={cur.audioMuted?faVolumeMute:faVolumeUp} /></Button>
            </InputGroup>
            <InputGroup className={"mb-3"}>
              <InputGroup.Text>{t("commandPlanner.overview.table.settings.notification")}</InputGroup.Text>
              <Button onClick={requestPermissions} disabled={!notificationsSupported || notificationsAllowed}>
                {t("commandPlanner.overview.table.settings.notificationPermission")}
              </Button>
              <InputGroup.Radio checked={!cur.sendNotifications} id={"command-table-notifications-disabled"}
                                disabled={!notificationsAllowed} onChange={e => changeNotificationState(!e.target.checked)} />
              <InputGroup.Text as={"label"} htmlFor={"command-table-notifications-disabled"}>
                {t("commandPlanner.overview.table.settings.notificationDisabled")}
              </InputGroup.Text>
              <InputGroup.Radio checked={cur.sendNotifications} id={"command-table-notifications-enabled"}
                                disabled={!notificationsAllowed} onChange={e => changeNotificationState(e.target.checked)} />
              <InputGroup.Text as={"label"} htmlFor={"command-table-notifications-enabled"}>
                {t("commandPlanner.overview.table.settings.notificationEnabled")}
              </InputGroup.Text>
              <Button onClick={() => playSound(undefined, true,  false)} disabled={!notificationsAllowed}>
                {t("commandPlanner.overview.table.settings.notificationTest")}
              </Button>
            </InputGroup>
          </Modal.Body>
        </BSModal>
      </Col>
  )
}

function useSearchCBCommandListItem(playerDict: Map<number, playerPureType>, vilDict: Map<number, villagePureType>) {
  const { t } = useTranslation("tool")
  const [playerBarbarian, playerDeleted] = useSpecialPlayerTranslations()

  const findInner = useCallback((vilId: number, search: string) => {
    const vil = vilDict.get(vilId)
    if(vil === undefined) {
      return playerDeleted.includes(search) || t("commandPlanner.overview.table.villageNotExist").includes(search)
    }
    if(vil.name.includes(search)) return true
    if(villageCoordinates(vil).includes(search)) return true

    if(vil.owner === 0) {
      return playerBarbarian.includes(search)
    }

    const player = playerDict.get(vil.owner)
    if(player === undefined) {
      return playerDeleted.includes(search)
    }

    return rawDecodeName(player.name).includes(search)
  }, [t, playerDict, vilDict, playerBarbarian, playerDeleted])

  return useCallback((d: CommandListItem, search: string) => {
    return findInner(d.startVillageId, search) || findInner(d.targetVillageId, search)
  }, [findInner])
}
