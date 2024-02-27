import {
  CommandList,
  CommandListItem,
  commandPlannerUnitName,
  useTypeIDToName
} from "../../../../modelHelper/Tool/CommandList"
import {useTranslation} from "react-i18next"
import {Card, Tooltip} from "react-bootstrap"
import DatatableBase, {DATATABLE_VARIANT, SORTING_DIRECTION} from "../../../../util/datatables/DatatableBase"
import {NumDict, StateUpdater} from "../../../../util/customTypes"
import DatatableHeaderBuilder from "../../../../util/datatables/DatatableHeaderBuilder"
import React, {useCallback, useEffect, useMemo, useState} from "react"
import {useAllPlayers, useAllVillages} from "../../../../apiInterface/worldDataAPI"
import {worldType} from "../../../../modelHelper/World"
import {LinkVillage, villagePureType} from "../../../../modelHelper/Village"
import {CommandPlannerMode} from "../CommandOverviewPage"
import {LinkPlayerGeneric, playerPureType} from "../../../../modelHelper/Player"
import ErrorPage from "../../../layout/ErrorPage"
import {CustomTooltip, dateFormatLocal_DMY_HMS} from "../../../../util/UtilFunctions"
import {get_icon, getUnitIcon} from "../../../../util/dsHelpers/Icon"


export function CommandTable({world, list, updateList, mode}: {world: worldType, list: CommandList, updateList: StateUpdater<CommandList>, mode: CommandPlannerMode}) {
  const [allVillageErr, allVillages] = useAllVillages(world)
  const allVillagesDict = useMemo(() => {
    const result: NumDict<villagePureType> = {}
    if(allVillages === undefined) return result
    allVillages.forEach(v => result[v.villageID] = v)
    return result
  }, [allVillages])

  const [allPlayerErr, allPlayers] = useAllPlayers(world)
  const allPlayersDict = useMemo(() => {
    const result: NumDict<playerPureType> = {}
    if(allPlayers === undefined) return result
    allPlayers.forEach(p => result[p.playerID] = p)
    return result
  }, [allPlayers])

  const commandListHeader = useCommandListHeader(allVillagesDict, mode)
  const VillageLink = useVillageLink(world, allVillagesDict)
  const PlayerLink = useVillagePlayerLink(world, allVillagesDict, allPlayersDict)
  const typeIdToName = useTypeIDToName()

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
                (c) => <TimeDiff date={c.sendTimestamp} />,
                () => "info",
                () => "action",
                () => "delete",
              ]}
              keyGen={data => data.id}
              //searching={searchCBCommandListItem}
              data={list.items}
              defaultSort={[7, SORTING_DIRECTION.ASC]}
              responsiveTable
              striped
              //topBarMiddle={<CommandTableAlarmConfig />}
              //topBarEnd={<CommandTableUVConfig />}
              limits={[10, 20, 50, 100, 1000]}
          />
        </Card.Body>
      </Card>
  )
}

function useCommandListHeader(allVillages: NumDict<villagePureType>, mode: CommandPlannerMode) {
  const { t } = useTranslation("tool")
  return useMemo(() => {
    return new DatatableHeaderBuilder<CommandListItem>()
        .addMainRow(row => {
          row.addCell({title: ""})
          row.addCell({title: t('commandPlanner.overview.prop.startVillage'),
            sortCB: (data1, data2) => data1.startVillageId - data2.startVillageId})
          row.addCell({title: t('commandPlanner.overview.table.attacker'),
            sortCB: (data1, data2) => {
              const owner1 = allVillages[data1.startVillageId]?.owner ?? -1
              const owner2 = allVillages[data2.startVillageId]?.owner ?? -1
              return owner1 - owner2
            }})
          row.addCell({title: t('commandPlanner.overview.prop.targetVillage'),
            sortCB: (data1, data2) => data1.targetVillageId - data2.targetVillageId})
          row.addCell({title: t('commandPlanner.overview.table.defender'),
            sortCB: (data1, data2) => {
              const owner1 = allVillages[data1.targetVillageId]?.owner ?? -1
              const owner2 = allVillages[data2.targetVillageId]?.owner ?? -1
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

function useVillageLink(world: worldType, allVillageDict: NumDict<villagePureType>) {
  const { t } = useTranslation("tool")

  return useCallback(({id}: {id: number}) => {
    const village = allVillageDict[id]
    if(village === undefined) {
      return <>{t("commandPlanner.overview.table.villageNotExist")}</>
    }
    return <LinkVillage village={village} world={world} />
  }, [t, world, allVillageDict])
}

function useVillagePlayerLink(world: worldType, allVillageDict: NumDict<villagePureType>, allPlayerDict: NumDict<playerPureType>) {
  return useCallback(({id}: {id: number}) => {
    const village = allVillageDict[id]
    if(village === undefined) {
      // village deleted -> owner -1 will show deleted
      return <LinkPlayerGeneric world={world} owner={-1} owner_name={null} />
    }
    const player = allPlayerDict[village.owner]
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

function TimeDiff({date}: {date: number}) {
  const [timeLeft, setTimeLeft] = useState<number>(date - (new Date()).getTime());

  useEffect(() => {
    const timer = setTimeout(() => {
      const diff = date - (new Date()).getTime()
      if(diff < 0) {
        clearTimeout(timer)
      }
      setTimeLeft(diff);
    }, 1000);
  });

  return <>{Math.round(timeLeft / 1000)}</>
}
