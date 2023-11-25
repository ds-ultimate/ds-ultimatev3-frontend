import {useTranslation} from "react-i18next";
import {worldType} from "./World";
import {Link} from "react-router-dom";
import {formatRoute} from "../util/router";
import {PLAYER_INFO, VILLAGE_INFO} from "../pages/routes";
import {DecodeName} from "../util/UtilFunctions";
import {chartDataType} from "../util/CustomChart";
import {cacheable} from "../apiInterface/MainDatabase"

export type villagePureType = {
  villageID: number,
  name: string,
  x: number,
  y: number,
  points: number,
  owner: number,
  bonus_id: number,
}

export type villagePlayerType = villagePureType & {
  playerLatest__name: string | null,
  playerLatest__ally_id: number | null,
}

export type villageType = villagePlayerType & {
  playerLatest__allyLatest__name: string | null,
  playerLatest__allyLatest__tag: string | null,
}

export type cachedVillageType = cacheable & villageType & {
  world: string,
  server: string,
}

export type villageBasicDataType = cacheable & {
  id: string,
  world: string,
  server: string,
  data: villageType,
  history: chartDataType
  conquer: {
    total: number,
  }
}

export function villageCoordinates(vil: villagePureType) {
  return `${vil.x}|${vil.y}`
}

export function villageContinent(vil: villagePureType) {
  return Math.round(vil.y / 100)*10 + Math.round(vil.x / 100)
}

export function LinkVillage({village, world}: {village: villagePureType, world: worldType}) {
  return (
      <>
        <Link to={formatRoute(VILLAGE_INFO, {server: world.server__code, world: world.name, village: (village.villageID + "")})}>
          <DecodeName name={village.name} />
        </Link>
      </>
  )
}

export function LinkVillageOwner({village, world}: {village: villageType, world: worldType}) {
  return (
      <>
        {village.playerLatest__name?(
            <Link to={formatRoute(PLAYER_INFO, {server: world.server__code, world: world.name, player: (village.owner + "")})}>
              <DecodeName name={village.playerLatest__name} />
            </Link>
        ):"-"}
      </>
  )
}

export function VillageBonusText({vil}: {vil: villagePureType}) {
  const {t} = useTranslation("ui")
  let result = "-"

  switch (vil.bonus_id) {
    case 0:
      result = "-"
      break
    case 1:
      result = t("village.bonus.wood", {amount: "+100%"})
      break
    case 2:
      result = t("village.bonus.clay", {amount: "+100%"})
      break
    case 3:
      result = t("village.bonus.iron", {amount: "+100%"})
      break
    case 4:
      result = t("village.bonus.population", {amount: "+10%"})
      break
    case 5:
      result = t("village.bonus.fastBarracks", {amount: "+33%"})
      break
    case 6:
      result = t("village.bonus.fastStable", {amount: "+33%"})
      break
    case 7:
      result = t("village.bonus.fastWorkshop", {amount: "+50%"})
      break
    case 8:
      result = t("village.bonus.allResources", {amount: "+33%"})
      break
    case 9:
      result = t("village.bonus.merchants", {amount: "+50%"})
      break

    case 11:
      result = t("village.bonus.greatSiege", {amountDef: "-25%", points: 7})
      break
    case 12:
      result = t("village.bonus.greatSiege", {amountDef: "-30%", points: 9})
      break
    case 13:
      result = t("village.bonus.greatSiege", {amountDef: "-35%", points: 10})
      break
    case 14:
      result = t("village.bonus.greatSiege", {amountDef: "-40%", points: 11})
      break
    case 15:
      result = t("village.bonus.greatSiege", {amountDef: "-45%", points: 13})
      break
    case 16:
      result = t("village.bonus.greatSiege", {amountDef: "-50%", points: 15})
      break
    case 17:
      result = t("village.bonus.greatSiege", {amountDef: "-55%", points: 17})
      break
    case 18:
      result = t("village.bonus.greatSiege", {amountDef: "-60%", points: 19})
      break
    case 19:
      result = t("village.bonus.greatSiege", {amountDef: "-65%", points: 21})
      break
    case 20:
      result = t("village.bonus.greatSiege", {amountDef: "-70%", points: 23})
      break
    case 21:
      result = t("village.bonus.greatSiege", {amountDef: "-75%", points: 25})
      break
  }

  return (
      <>
        {result}
      </>
  )
}
