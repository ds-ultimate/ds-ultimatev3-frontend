import {useTranslation} from "react-i18next"
import {useCallback} from "react"
import {TroopArmyAmounts} from "../../util/dsHelpers/TroopHelper"
import {worldType, worldUnitType} from "../World"
import {villagePureType} from "../Village"
import {getVillageInfoId} from "../../apiInterface/worldDataAPI"


export type CommandListItem = {
  id: number,
  startVillageId: number,
  targetVillageId: number,
  unit: number,
  sendTimestamp: number,
  arriveTimestamp: number,
  type: number,
  troops: TroopArmyAmounts,
  sent: boolean,
  tribeBoost: number,
  supportBoost: number,
}

export type NewCommandListItem = Omit<CommandListItem, "id">

export type CommandList = {
  id: number,
  world_id: number,
  title: string | null,
  edit_key: string,
  show_key: string,
  uvMode: boolean,
  items: CommandListItem[],
}

export function useCommandPlannerTypeIconsGrouped(){
  const { t } = useTranslation("tool")
  return [
    { title: t('commandPlanner.overview.offensive'), items: [8, 11, 14, 45] },
    { title: t('commandPlanner.overview.defensive'), items: [0, 1, 7, 46] },
    { title: t('commandPlanner.overview.building'), items: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44] },
    { title: t('commandPlanner.overview.otherUnits'), items: [2, 3, 4, 5, 6, 9, 10] },
    { title: t('commandPlanner.overview.iconsTitle'), items: [12, 13, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29] },
  ]
}

export function useTypeIDToName() {
  const [ tUi ] = useTranslation("ui")
  const { t } = useTranslation("tool")

  return useCallback((type: number) => {
    if(type === 8) return t('commandPlanner.overview.type.attack')
    if(type === 11) return t('commandPlanner.overview.type.conquest')
    if(type === 14) return t('commandPlanner.overview.type.fake')
    if(type === 45) return t('commandPlanner.overview.type.wallbreaker')

    if(type === 0) return t('commandPlanner.overview.type.support')
    if(type === 1) return t('commandPlanner.overview.type.standSupport')
    if(type === 7) return t('commandPlanner.overview.type.fastSupport')
    if(type === 46) return t('commandPlanner.overview.type.fakeSupport')

    if(type === 30) return tUi('buildings.main')
    if(type === 31) return tUi('buildings.barracks')
    if(type === 32) return tUi('buildings.stable')
    if(type === 33) return tUi('buildings.garage')
    if(type === 34) return tUi('buildings.church')
    if(type === 35) return tUi('buildings.snob')
    if(type === 36) return tUi('buildings.smith')
    if(type === 37) return tUi('buildings.place')
    if(type === 38) return tUi('buildings.statue')
    if(type === 39) return tUi('buildings.market')
    if(type === 40) return tUi('buildings.wood')
    if(type === 41) return tUi('buildings.stone')
    if(type === 42) return tUi('buildings.iron')
    if(type === 43) return tUi('buildings.farm')
    if(type === 44) return tUi('buildings.storage')

    if(type === 2) return tUi('unit.axe')
    if(type === 3) return tUi('unit.archer')
    if(type === 4) return tUi('unit.spy')
    if(type === 5) return tUi('unit.light')
    if(type === 6) return tUi('unit.marcher')
    if(type === 9) return tUi('unit.catapult')
    if(type === 10) return tUi('unit.knight')

    if(type === 12) return t('commandPlanner.overview.type.icons.devCav')
    if(type === 13) return t('commandPlanner.overview.type.icons.devArcher')
    if(type === 15) return t('commandPlanner.overview.type.icons.wbAlly')
    if(type === 16) return t('commandPlanner.overview.type.icons.moveOut')
    if(type === 17) return t('commandPlanner.overview.type.icons.moveIn')
    if(type === 18) return t('commandPlanner.overview.type.icons.ballBlue')
    if(type === 19) return t('commandPlanner.overview.type.icons.ballGreen')
    if(type === 20) return t('commandPlanner.overview.type.icons.ballYellow')
    if(type === 21) return t('commandPlanner.overview.type.icons.ballRed')
    if(type === 22) return t('commandPlanner.overview.type.icons.ballGrey')
    if(type === 23) return t('commandPlanner.overview.type.icons.wbWarning')
    if(type === 24) return t('commandPlanner.overview.type.icons.wbDie')
    if(type === 25) return t('commandPlanner.overview.type.icons.wbAdd')
    if(type === 26) return t('commandPlanner.overview.type.icons.wbRemove')
    if(type === 27) return t('commandPlanner.overview.type.icons.wbCheckbox')
    if(type === 28) return t('commandPlanner.overview.type.icons.wbEye')
    if(type === 29) return t('commandPlanner.overview.type.icons.wbEyeForbidden')
  }, [t, tUi])
}

export const commandPlannerUnitName = [
  'spear', 'sword', 'axe', 'archer', 'spy', 'light', 'marcher', 'heavy', 'ram', 'catapult', 'knight', 'snob'
]

type SendOmit<T> = Omit<T, "sendTimestamp"> & {sendTimestamp?: number}

export function calculateSendTime(item: SendOmit<CommandListItem>, world: worldType, unitConf: worldUnitType): Promise<CommandListItem>
export function calculateSendTime(item: SendOmit<NewCommandListItem>, world: worldType, unitConf: worldUnitType): Promise<NewCommandListItem>
export async function calculateSendTime(item: SendOmit<CommandListItem | NewCommandListItem>, world: worldType, unitConf: worldUnitType): Promise<NewCommandListItem | CommandListItem> {
  const travelTime = await calculateTravelTime(item, world, unitConf)
  return {...item, sendTimestamp: item.arriveTimestamp-travelTime}
}

type ArriveOmit<T> = Omit<T, "arriveTimestamp"> & {arriveTimestamp?: number}
export function calculateArrivalTime(item: ArriveOmit<CommandListItem>, world: worldType, unitConf: worldUnitType): Promise<CommandListItem>
export function calculateArrivalTime(item: ArriveOmit<NewCommandListItem>, world: worldType, unitConf: worldUnitType): Promise<NewCommandListItem>
export async function calculateArrivalTime(item: ArriveOmit<CommandListItem | NewCommandListItem>, world: worldType, unitConf: worldUnitType): Promise<NewCommandListItem | CommandListItem> {
  const travelTime = await calculateTravelTime(item, world, unitConf)
  return {...item, arriveTimestamp: item.sendTimestamp+travelTime}
}

type TimeOptional = Omit<NewCommandListItem, "sendTimestamp" | "arriveTimestamp"> & {id?: number, sendTimestamp?: number, arriveTimestamp?: number}
export async function calculateTravelTime(item: TimeOptional, world: worldType, unitConf: worldUnitType) {
  const startProm = getVillageInfoId(world, item.startVillageId)
  const targetProm = getVillageInfoId(world, item.targetVillageId)
  const start = await startProm, target = await targetProm
  if(start === undefined || target === undefined) {
    return 0
  }
  const distance = calculateDistance(start, target, item.unit)
  const speed = unitConf[commandPlannerUnitName[item.unit]]?.speed
  if(speed === undefined) {
    return 0
  }

  const boost = 1 + item.tribeBoost + item.supportBoost
  return Math.round(speed * 60 * distance / boost)
}

export function calculateDistance(startVillage: villagePureType, targetVillage: villagePureType, unit: number) {
  if(targetVillage.bonus_id >= 11 && targetVillage.bonus_id <= 21) {
    //great siege village always same distance
    if(unit === 4) {
      return 3; // spy
    } else {
      return 15;
    }
  }

  const xDiff = startVillage.x - targetVillage.x
  const yDiff = startVillage.y - targetVillage.y
  return Math.sqrt(xDiff*xDiff + yDiff*yDiff)
}
