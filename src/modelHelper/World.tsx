import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faBan, faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Dict} from "../util/customTypes";
import {worldConfigType} from "./WorldConfig";

export type worldType = {
  id: number,
  name: string,
  display_name: string | null,
  ally_count: number,
  player_count: number,
  village_count: number,
  active: boolean | null,
  maintenanceMode: boolean,
  server__code: string,
  url: string,
  hasConfig: boolean,
  hasUnits: boolean,
  hasBuildings: boolean,
  sortType: string,
}

export type worldExtendedType = {
  firstConquer: number,
  config: worldConfigType,
  buildings: worldBuildingType,
  units: worldUnitType,
}

type worldBuildingType = Dict<{
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

type worldUnitType = Dict<{
  build_time: number,
  pop: number,
  speed: number,
  attack: number,
  defense: number,
  defense_cavalry: number,
  defense_archer: number,
  carry: number,
}>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DummyFunction = () => {
  const { t } = useTranslation("ui")
  //tell translation interface that we need these
  t("world.speed")
  t("world.casual")
  t("world.world")
  t("world.classic")
}

export function WorldDisplayName({world}: {world: worldType}) {
  const { t } = useTranslation("ui")
  return (
      <>
        {(world.display_name != null)?world.display_name:t("world." + world.sortType) + " " + world.name.replace(/[^0-9]+/, "")}
      </>
  )
}

export function WorldState({world}: {world: worldType}) {
  let spanClass: string
  let fontIcon: IconProp
  if(world.active == null) {
    spanClass = "text-danger"
    fontIcon = faBan
  } else if(world.active) {
    spanClass = "text-success"
    fontIcon = faCheck
  } else {
    spanClass = "text-danger"
    fontIcon = faTimes
  }
  return (
      <span className={spanClass} >
      <FontAwesomeIcon icon={fontIcon} />
      </span>
  )
}
