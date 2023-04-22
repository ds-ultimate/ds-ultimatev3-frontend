import {worldType} from "./World";
import {Link} from "react-router-dom";
import {formatRoute} from "../util/router";
import {ALLY_INFO, PLAYER_INFO} from "../util/routes";
import {DecodeName} from "../util/UtilFunctions";


type playerPureType = {
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

type playerType = playerPureType & {
  allyLatest__tag: string | null,
  allyLatest__name: string | null,
}

const LinkPlayer = ({player, world, withAlly}: {player: playerType, world: worldType, withAlly?: boolean}) => {
  return (
      <>
        <Link to={formatRoute(PLAYER_INFO, {server: world.server__code, world: world.name, player: (player.playerID + "")})}>
          <DecodeName name={player.name} />
        </Link>
        {withAlly && player.allyLatest__tag && <LinkPlayerAlly player={player} world={world} />}
      </>
  )
}

const LinkPlayerAlly = ({player, world}: {player: playerType, world: worldType}) => {
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

export type {playerType, playerPureType}
export {LinkPlayer, LinkPlayerAlly}
