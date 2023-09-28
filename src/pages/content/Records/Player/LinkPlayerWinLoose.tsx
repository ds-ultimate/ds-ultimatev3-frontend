import {Link} from "react-router-dom";
import {formatRoute} from "../../../../util/router";
import {PLAYER_ALLY_CHANGES, PlAYER_CONQUER} from "../../../routes";
import {CustomTooltip, nf} from "../../../../util/UtilFunctions";
import {worldType} from "../../../../modelHelper/World";
import {Tooltip} from "react-bootstrap";
import {useTranslation} from "react-i18next";

type paramTypesPlayerConquer = {
  player_id: number,
  world: worldType,
  conquer: {
    old: number,
    new: number,
    own: number,
    total: number,
  },
}

export function LinkPlayerConquer({player_id, world, conquer}: paramTypesPlayerConquer) {
  const {t} = useTranslation("ui")

  return (
      <>
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.total")}</Tooltip>}>
          <Link to={formatRoute(PlAYER_CONQUER, {server: world.server__code, world: world.name, player: (player_id + ""), type: "all"})}>
            {nf.format(conquer.total)}
          </Link>
        </CustomTooltip>
        {" ( "}
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.win")}</Tooltip>}>
          <Link to={formatRoute(PlAYER_CONQUER, {server: world.server__code, world: world.name, player: (player_id + ""), type: "new"})} className={"text-success"}>
            {nf.format(conquer.new)}
          </Link>
        </CustomTooltip>
        {" - "}
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.self")}</Tooltip>}>
          <Link to={formatRoute(PlAYER_CONQUER, {server: world.server__code, world: world.name, player: (player_id + ""), type: "own"})} className={"text-info"}>
            {nf.format(conquer.own)}
          </Link>
        </CustomTooltip>
        {" - "}
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.loose")}</Tooltip>}>
          <Link to={formatRoute(PlAYER_CONQUER, {server: world.server__code, world: world.name, player: (player_id + ""), type: "old"})} className={"text-danger"}>
            {nf.format(conquer.old)}
          </Link>
        </CustomTooltip>
        {" ) "}
      </>
  )
}

type paramTypesAllyAllyChanges = {
  player_id: number,
  world: worldType,
  allyChanges: {
    total: number,
  },
}
export function LinkPlayerAllyChanges({player_id, world, allyChanges}: paramTypesAllyAllyChanges) {
  const {t} = useTranslation("ui")

  return (
      <>
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.total")}</Tooltip>}>
          <Link to={formatRoute(PLAYER_ALLY_CHANGES, {server: world.server__code, world: world.name, player: (player_id + ""), type: "all"})}>
            {nf.format(allyChanges.total)}
          </Link>
        </CustomTooltip>
      </>
  )
}
