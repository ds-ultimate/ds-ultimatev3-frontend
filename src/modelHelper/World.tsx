import {useTranslation} from "react-i18next";

type worldType = {
  id: number,
  name: string,
  display_name: string | null,
  ally_count: number,
  player_count: number,
  village_count: number,
  active: boolean | null,
  maintenanceMode: boolean,
  server: string,
  hasConfig: boolean,
  hasUnits: boolean,
  hasBuildings: boolean,
  sortType: string,
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
  let classes: string
  if(world.active == null) {
    classes = "fas fa-ban text-danger"
  } else if(world.active) {
    classes = "fas fa-check text-success"
  } else {
    classes = "fas fa-times text-danger"
  }
  return (
      <>
        {/* TODO just use icon here */}
        <span className={classes}>{world.active}</span>
      </>
  )
}

export type {worldType}
export {WorldDisplayName, WorldState}
