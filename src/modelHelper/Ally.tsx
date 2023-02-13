import {worldType} from "./World";
import {Link} from "react-router-dom";
import {formatRoute} from "../util/router";
import {ALLY_INFO} from "../util/routes";
import {DecodeName} from "../util/UtilFunctions";

type allyType = {
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

const LinkAlly = ({ally, world, useTag}: {ally: allyType, world: worldType, useTag?: boolean}) => {
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

export type {allyType}
export {LinkAlly}
