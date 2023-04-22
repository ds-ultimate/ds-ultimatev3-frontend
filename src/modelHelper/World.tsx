import {useTranslation} from "react-i18next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faBan, faCheck, faTimes} from "@fortawesome/free-solid-svg-icons";

type worldType = {
  id: number,
  name: string,
  display_name: string | null,
  ally_count: number,
  player_count: number,
  village_count: number,
  active: boolean | null,
  maintenanceMode: boolean,
  server__code: string,
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

type worldConfigType = {
  //TODO for later
}

type worldBuildingType = {
  //TODO for later
}

type worldUnitType = {
  //TODO for later
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DummyFunction = () => {
  const { t } = useTranslation("ui")
  //tell translation interface that we need these
  t("world.speed")
  t("world.casual")
  t("world.world")
  t("world.classic")
}

const WorldDisplayName = ({world}: {world: worldType}) => {
  const { t } = useTranslation("ui")
  return (
      <>
        {(world.display_name != null)?world.display_name:t("world." + world.sortType) + " " + world.name.replace(/[^0-9]+/, "")}
      </>
  )
}

const WorldState = ({world}: {world: worldType}) => {
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

export type {worldType}
export {WorldDisplayName, WorldState}
