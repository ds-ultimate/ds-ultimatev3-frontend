import {worldType} from "./World";
import {Link} from "react-router-dom";
import {formatRoute} from "../util/router";
import {ALLY_INFO} from "../util/routes";
import {DecodeName} from "../util/UtilFunctions";
import {chartDataType} from "../util/CustomChart";
import {useTranslation} from "react-i18next";

export type allyType = {
  allyID: number,
  name: string,
  tag: string,
  member_count: number,
  points: number,
  village_count: number,
  rank: number,
  offBash: number,
  offBashRank: number,
  defBash: number,
  defBashRank: number,
  gesBash: number,
  gesBashRank: number,
}

export type allyTopType = {
  allyID: number,
  name: string,
  tag: string,
  member_count_top: number,
  member_count_date: string,
  points_top: number,
  points_date: string,
  village_count_top: number,
  village_count_date: string,
  rank_top: number,
  rank_date: string,
  offBash_top: number,
  offBash_date: string,
  offBashRank_top: number,
  offBashRank_date: string,
  defBash_top: number,
  defBash_date: string,
  defBashRank_top: number,
  defBashRank_date: string,
  gesBash_top: number,
  gesBash_date: string,
  gesBashRank_top: number,
  gesBashRank_date: string,
}

export type allyBasicDataType = {
  cur: allyType | null,
  top: allyTopType | null,
  conquer: {
    old: number,
    new: number,
    own: number,
    total: number,
  },
  changes: {
    old: number,
    new: number,
    total: number,
  },
}

export type allyChartDataType = {
  general: {
    points: chartDataType,
    rank: chartDataType,
    village: chartDataType,
  },
  bash: {
    gesBash: chartDataType,
    offBash: chartDataType,
    defBash: chartDataType,
  },
}

export function LinkAlly ({ally, world, useTag}: {ally: allyType, world: worldType, useTag?: boolean}) {
  return (
      <>
        <Link to={formatRoute(ALLY_INFO, {server: world.server__code, world: world.name, ally: (ally.allyID + "")})}>
          {useTag?(
              <DecodeName name={ally.tag} />
          ):(
              <DecodeName name={ally.name} />
          )}
        </Link>
      </>
  )
}

export function LinkAllyGeneric({ally, ally_tag, ally_name, world, useTag}: {ally: number, ally_tag: string | null,
  ally_name: string | null, world: worldType, useTag?: boolean}) {
  const { t } = useTranslation("ui")
  if(ally === 0) {
    if(useTag) return null
    return <>-</>
  }
  if(ally_tag === null || ally_name === null) {
    return (
        <>
          {useTag?<>[{t("player.deleted")}]</>:t("player.deleted")}
        </>
    )
  }

  return (
      <Link to={formatRoute(ALLY_INFO, {server: world.server__code, world: world.name, ally: (ally + "")})}>
        {useTag?<>[<DecodeName name={ally_tag} />]</>:<DecodeName name={ally_name} />}
      </Link>
  )
}
