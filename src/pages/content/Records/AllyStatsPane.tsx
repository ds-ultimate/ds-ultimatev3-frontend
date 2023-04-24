import {useTranslation} from "react-i18next";
import {Card, Col, Row} from "react-bootstrap";

import {allyType} from "../../../modelHelper/Ally";
import {worldType} from "../../../modelHelper/World";
import {DecodeName, nf, thousandsFormat} from "../../../util/UtilFunctions";
import {LinkAllyAllyChanges, LinkAllyConquer} from "./LinkAllyWinLoose";
import {Link} from "react-router-dom";
import {formatRoute} from "../../../util/router";
import {ALLY_BASH_RANKING} from "../../../util/routes";

import {LinkAllyInGame, ResponsiveRecordTable} from "./Util";

type paramType = {
  data: allyType,
  worldData: worldType | undefined,
  conquer: {
    old: number,
    new: number,
    own: number,
    total: number,
  },
  allyChanges: {
    old: number,
    new: number,
    total: number,
  },
}


export default function AllyStatsPane({data, worldData, conquer, allyChanges}: paramType) {
  const {t} = useTranslation("ui")

  return (
      <Row>
        <Col xs={12} md={6}>
          <Card.Title as={"h4"}>{t("table-title.info")}</Card.Title>
        </Col>
        <Col xs={12} md={6}>
          <span className={"float-end"}>
            {worldData && <LinkAllyInGame worldData={worldData} ally_id={data.allyID}>{t("inGame.normal")}</LinkAllyInGame>}
            {worldData && <LinkAllyInGame worldData={worldData} ally_id={data.allyID} guestMode>{t("inGame.guest")}</LinkAllyInGame>}
          </span>
        </Col>
        <ResponsiveRecordTable title={t("table-title.general")} tableData={[
          ["rank", t("table.rank"), nf.format(data.rank)],
          ["name", t("table.name"), <DecodeName name={data.name} />],
          ["tag", t("table.tag"), <DecodeName name={data.tag} />],
          ["points", t("table.points"), thousandsFormat(data.points)],
          ["villages", t("table.villages"), nf.format(data.village_count)],
          ["members", t("table.members"), nf.format(data.member_count)],
          ["avgPlayer", t("table.avgPlayer"), data.member_count !== 0?thousandsFormat(data.points / data.member_count):"-"],
          ["avgVillage", t("table.avgVillage"), data.village_count !== 0?nf.format(Math.round(data.points / data.village_count)):"-"],
          ["conquer", t("table.conquer"), (worldData && <LinkAllyConquer ally_id={data.allyID} world={worldData} conquer={conquer} />)],
          ["allyChanges", t("table.allyChanges"), (worldData && <LinkAllyAllyChanges ally_id={data.allyID} world={worldData} allyChanges={allyChanges} />)],
        ]} />
        <ResponsiveRecordTable title={
          <>
            {t("table-title.bashStats")}
            {worldData && <span className={"float-end"}>
              <Link to={formatRoute(ALLY_BASH_RANKING, {server: worldData.server__code, world: worldData.name, ally: (data.allyID + "")})}
                    className={"btn btn-primary btn-sm"}>
                {t("table-title.allyBashRanking")}
              </Link>
            </span>}
          </>
        } tableData={[
          ["gesBashRank", <>{t("table.rank")} {t("table.bashGes")}</>, nf.format(data.gesBashRank)],
          ["gesBash", <>{t("table.points")} {t("table.bashGes")}</>, thousandsFormat(data.gesBash)],
          ["bashRatio", t("table.bashPointsRatio"), <>{data.points !== 0?nf.format(Math.round(100 * data.gesBash / data.points)):"-"}%</>],
          ["offBashRank", <>{t("table.rank")} {t("table.bashOff")}</>, nf.format(data.offBashRank)],
          ["offBash", <>{t("table.points")} {t("table.bashOff")}</>, thousandsFormat(data.offBash)],
          ["defBashRank", <>{t("table.rank")} {t("table.bashDef")}</>, nf.format(data.defBashRank)],
          ["defBash", <>{t("table.points")} {t("table.bashDef")}</>, thousandsFormat(data.defBash)],
        ]} />
      </Row>
  )
}
