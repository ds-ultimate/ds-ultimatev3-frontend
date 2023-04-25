import {worldType} from "./World";
import {Link} from "react-router-dom";
import {formatRoute} from "../util/router";
import {ALLY_INFO, PLAYER_INFO} from "../util/routes";
import {DecodeName} from "../util/UtilFunctions";
import {useTranslation} from "react-i18next";


export type playerPureType = {
  playerID: number,
  name: string,
  ally_id: number,
  village_count: number,
  points: number,
  rank: number,
  offBash: number,
  offBashRank: number,
  defBash: number,
  defBashRank: number,
  supBash: number,
  supBashRank: number,
  gesBash: number,
  gesBashRank: number,
}

export type playerType = playerPureType & {
  allyLatest__tag: string | null,
  allyLatest__name: string | null,
}

export function LinkPlayer({player, world, withAlly}: {player: playerType, world: worldType, withAlly?: boolean}) {
  return (
      <>
        <Link to={formatRoute(PLAYER_INFO, {server: world.server__code, world: world.name, player: (player.playerID + "")})}>
          <DecodeName name={player.name} />
        </Link>
        {withAlly && player.allyLatest__tag && <LinkPlayerAlly player={player} world={world} />}
      </>
  )
}

export function LinkPlayerAlly({player, world}: {player: playerType, world: worldType}) {
  return (
      <>
        {player.allyLatest__tag?(
            <Link to={formatRoute(ALLY_INFO, {server: world.server__code, world: world.name, ally: (player.ally_id + "")})}>
              {" "}[<DecodeName name={player.allyLatest__tag} />]
            </Link>
        ):"-"}
      </>
  )
}

export function LinkPlayerGeneric({owner, owner_name, world}: {owner: number, owner_name: string | null, world: worldType}) {
  const { t } = useTranslation("ui")
  if(owner === 0) {
    return <>{t("player.barbarian")}</>
  }
  if(owner_name === null) {
    return <>{t("player.deleted")}</>
  }

  return (
      <Link to={formatRoute(PLAYER_INFO, {server: world.server__code, world: world.name, player: (owner + "")})}>
        <DecodeName name={owner_name} />
      </Link>
  )
}
