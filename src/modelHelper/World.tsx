import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faBan, faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Dict} from "../util/customTypes";
import {worldConfigType} from "./WorldConfig";
import {CustomTooltip} from "../util/UtilFunctions"
import {Tooltip} from "react-bootstrap"
import {TFunction} from "i18next"
import {cacheable} from "../apiInterface/AbstractDatabase"

export enum WorldActiveMode {
  INACTIVE,
  DISABLED,
  ACTIVE,
}

export type worldType = cacheable & {
  id: number,
  name: string,
  display_name: string | null,
  ally_count: number,
  player_count: number,
  village_count: number,
  active: WorldActiveMode,
  maintenanceMode: boolean,
  server__code: string,
  url: string,
  hasConfig: boolean,
  hasUnits: boolean,
  hasBuildings: boolean,
  sortType: string,
}

export type worldExtendedType = cacheable & {
  server: string,
  world: string,
  firstConquer: number | null,
  config: worldConfigType | null,
  buildings: worldBuildingType | null,
  units: worldUnitType | null,
}

export type worldBuildingType = Dict<{
  max_level: number,
  min_level: number,
  wood: number | {},
  stone: number | {},
  iron: number | {},
  pop: number | {},
  wood_factor: number | {},
  stone_factor: number | {},
  iron_factor: number | {},
  pop_factor: number | {},
  build_time: number | {},
  build_time_factor: number | {},
}>

export type worldUnitType = Dict<worldUnitSingeType>

export type worldUnitSingeType = {
  build_time: number,
  pop: number,
  speed: number,
  attack: number,
  defense: number,
  defense_cavalry: number,
  defense_archer: number,
  carry: number,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DummyFunction = () => {
  const { t } = useTranslation("ui")
  //tell translation interface that we need these
  t("world.speed")
  t("world.casual")
  t("world.world")
  t("world.classic")

  t("unit.spear")
  t("unit.sword")
  t("unit.axe")
  t("unit.archer")
  t("unit.spy")
  t("unit.light")
  t("unit.marcher")
  t("unit.heavy")
  t("unit.ram")
  t("unit.catapult")
  t("unit.knight")
  t("unit.snob")
  t("unit.militia")
}

export function WorldDisplayName({world}: {world: worldType}) {
  const { t } = useTranslation("ui")
  return (
      <>
        {worldDisplayNameRaw(t, world)}
      </>
  )
}

export function worldDisplayNameRaw(t: TFunction<"ui", undefined, "ui">, world: worldType) {
  return (world.display_name != null)?world.display_name:t("world." + world.sortType) + " " + world.name.replace(/[^0-9]+/, "")
}

export function WorldState({world}: {world: worldType}) {
  const { t } = useTranslation("ui")

  let spanClass: string
  let fontIcon: IconProp
  let tooltipText: string
  if(world.active == null) {
    spanClass = "text-danger"
    fontIcon = faBan
    tooltipText = t("world.state.inactive")
  } else if(world.active) {
    spanClass = "text-success"
    fontIcon = faCheck
    tooltipText = t("world.state.active")
  } else {
    spanClass = "text-danger"
    fontIcon = faTimes
    tooltipText = t("world.state.disabled")
  }
  return (
      <CustomTooltip overlay={<Tooltip>{tooltipText}</Tooltip>}>
        <span className={spanClass} >
          <FontAwesomeIcon icon={fontIcon} />
        </span>
      </CustomTooltip>
  )
}
