import {worldType} from "./World";
import {Link} from "react-router-dom";
import {formatRoute} from "../util/router";
import {ALLY_INFO, PLAYER_INFO} from "../util/routes";
import {DecodeName} from "../util/UtilFunctions";

type playerType = {
  playerID: number,
  name: string,
  ally_id: number,
  ally_tag: string | null,
  ally_name: string | null,
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

const LinkPlayer = ({player, world, withAlly}: {player: playerType, world: worldType, withAlly?: boolean}) => {
  return (
      <>
        <Link to={formatRoute(PLAYER_INFO, {server: world.server, world: world.name, player: (player.playerID + "")})}>
          <DecodeName name={player.name} />
        </Link>
        {withAlly && player.ally_tag && (
            <Link to={formatRoute(ALLY_INFO, {server: world.server, world: world.name, ally: (player.ally_id + "")})}>
              [<DecodeName name={player.ally_tag} />]
            </Link>
        )}
      </>
  )
}

export type {playerType}
export {LinkPlayer}
