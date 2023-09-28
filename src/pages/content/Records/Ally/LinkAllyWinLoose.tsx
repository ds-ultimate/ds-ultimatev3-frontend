import {Link} from "react-router-dom";
import {formatRoute} from "../../../../util/router";
import {ALLY_ALLY_CHANGES, ALLY_CONQUER} from "../../../routes";
import {CustomTooltip, nf} from "../../../../util/UtilFunctions";
import {worldType} from "../../../../modelHelper/World";
import {Tooltip} from "react-bootstrap";
import {useTranslation} from "react-i18next";

type paramTypesAllyConquer = {
  ally_id: number,
  world: worldType,
  conquer: {
    old: number,
    new: number,
    own: number,
    total: number,
  },
}

export function LinkAllyConquer({ally_id, world, conquer}: paramTypesAllyConquer) {
  const {t} = useTranslation("ui")

  return (
      <>
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.total")}</Tooltip>}>
          <Link to={formatRoute(ALLY_CONQUER, {server: world.server__code, world: world.name, ally: (ally_id + ""), type: "all"})}>
            {nf.format(conquer.total)}
          </Link>
        </CustomTooltip>
        {" ( "}
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.win")}</Tooltip>}>
          <Link to={formatRoute(ALLY_CONQUER, {server: world.server__code, world: world.name, ally: (ally_id + ""), type: "new"})} className={"text-success"}>
            {nf.format(conquer.new)}
          </Link>
        </CustomTooltip>
        {" - "}
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.self")}</Tooltip>}>
          <Link to={formatRoute(ALLY_CONQUER, {server: world.server__code, world: world.name, ally: (ally_id + ""), type: "own"})} className={"text-info"}>
            {nf.format(conquer.own)}
          </Link>
        </CustomTooltip>
        {" - "}
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.loose")}</Tooltip>}>
          <Link to={formatRoute(ALLY_CONQUER, {server: world.server__code, world: world.name, ally: (ally_id + ""), type: "old"})} className={"text-danger"}>
            {nf.format(conquer.old)}
          </Link>
        </CustomTooltip>
        {" ) "}
      </>
  )
}

type paramTypesAllyAllyChanges = {
  ally_id: number,
  world: worldType,
  allyChanges: {
    old: number,
    new: number,
    total: number,
  },
}
export function LinkAllyAllyChanges({ally_id, world, allyChanges}: paramTypesAllyAllyChanges) {
  const {t} = useTranslation("ui")

  return (
      <>
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.total")}</Tooltip>}>
          <Link to={formatRoute(ALLY_ALLY_CHANGES, {server: world.server__code, world: world.name, ally: (ally_id + ""), type: "all"})}>
            {nf.format(allyChanges.total)}
          </Link>
        </CustomTooltip>
        {" ( "}
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.win")}</Tooltip>}>
          <Link to={formatRoute(ALLY_ALLY_CHANGES, {server: world.server__code, world: world.name, ally: (ally_id + ""), type: "new"})} className={"text-success"}>
            {nf.format(allyChanges.new)}
          </Link>
        </CustomTooltip>
        {" - "}
        <CustomTooltip overlay={<Tooltip>{t("conquer.highlight.loose")}</Tooltip>}>
          <Link to={formatRoute(ALLY_ALLY_CHANGES, {server: world.server__code, world: world.name, ally: (ally_id + ""), type: "old"})} className={"text-danger"}>
            {nf.format(allyChanges.old)}
          </Link>
        </CustomTooltip>
        {" ) "}
      </>
  )
}
