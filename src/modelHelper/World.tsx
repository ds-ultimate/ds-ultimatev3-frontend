import {useTranslation} from "react-i18next";

type worldType = {
  id: number,
  name: string,
  display_name: string | null,
  ally_count: number,
  player_count: number,
  village_count: number,
  active: boolean | null,
  maintananceMode: boolean,
  server: string,
  hasConfig: boolean,
  hasUnits: boolean,
  hasBuildings: boolean,
  sortType: string,
}

const WorldDisplayName = (world: worldType) => {
  const t = useTranslation("ui")[0]
  return (
      <>
        {(world.display_name != null)?world.display_name:t("world." + world.sortType) + " " + world.name.replace(/[^0-9]+/, "")}
      </>
  )
}

export type {worldType}
export {WorldDisplayName}
