import {useTranslation} from "react-i18next";
import {Card, Col, Row} from "react-bootstrap";

import {allyTopType} from "../../../../modelHelper/Ally";
import {worldType} from "../../../../modelHelper/World";

import {LinkAllyInGame, ResponsiveRecordTable, TopElement} from "../Util";
import {DecodeName, nf, thousandsFormat} from "../../../../util/UtilFunctions";
import {LinkAllyAllyChanges, LinkAllyConquer} from "./LinkAllyWinLoose";
import {Link} from "react-router-dom";
import {formatRoute} from "../../../../util/router";
import {ALLY_BASH_RANKING} from "../../../routes";

type paramType = {
  data: allyTopType,
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
  exists: boolean,
}

export default function AllyTopStatsPane({data, worldData, conquer, allyChanges, exists}: paramType) {
  const {t} = useTranslation("ui")

  return (
      <Row>
        <Col xs={12} md={6}>
          <Card.Title as={"h4"}>{t("table-title.info")}</Card.Title>
        </Col>
        <Col xs={12} md={6}>
          {exists && <span className={"float-end"}>
            {worldData && <LinkAllyInGame worldData={worldData} ally_id={data.allyID}>{t("inGame.normal")}</LinkAllyInGame>}
            {worldData && <LinkAllyInGame worldData={worldData} ally_id={data.allyID} guestMode>{t("inGame.guest")}</LinkAllyInGame>}
          </span>}
        </Col>
        <ResponsiveRecordTable title={t("table-title.general")} breakpoint={"xl"} tableData={[
          ["rank", t("table.rank"), <TopElement val={nf.format(data.rank_top)} date={data.rank_date} />],
          ["name", t("table.name"), <DecodeName name={data.name} />],
          ["tag", t("table.tag"), <DecodeName name={data.tag} />],
          ["points", t("table.points"), <TopElement val={thousandsFormat(data.points_top)} date={data.points_date} />],
          ["villages", t("table.villages"), <TopElement val={nf.format(data.village_count_top)} date={data.village_count_date} />],
          ["members", t("table.members"), <TopElement val={nf.format(data.member_count_top)} date={data.member_count_date} />],
          ["avgPlayer", t("table.avgPlayer"), data.member_count_top !== 0?thousandsFormat(data.points_top / data.member_count_top):"-"],
          ["avgVillage", t("table.avgVillage"), data.village_count_top !== 0?nf.format(Math.round(data.points_top / data.village_count_top)):"-"],
          ["conquer", t("table.conquer"), (worldData && <LinkAllyConquer ally_id={data.allyID} world={worldData} conquer={conquer} />)],
          ["allyChanges", t("table.allyChanges"), (worldData && <LinkAllyAllyChanges ally_id={data.allyID} world={worldData} allyChanges={allyChanges} />)],
        ]} />
        <ResponsiveRecordTable breakpoint={"xl"} title={
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
          ["gesBashRank", <>{t("table.rank")} {t("table.bashGes")}</>, <TopElement val={nf.format(data.gesBashRank_top)} date={data.gesBashRank_date} />],
          ["gesBash", <>{t("table.points")} {t("table.bashGes")}</>, <TopElement val={thousandsFormat(data.gesBash_top)} date={data.gesBash_date} />],
          ["bashRatio", t("table.bashPointsRatio"), <>{data.points_top !== 0?nf.format(Math.round(100 * data.gesBash_top / data.points_top)):"-"}%</>],
          ["offBashRank", <>{t("table.rank")} {t("table.bashOff")}</>, <TopElement val={nf.format(data.offBashRank_top)} date={data.offBashRank_date} />],
          ["offBash", <>{t("table.points")} {t("table.bashOff")}</>, <TopElement val={thousandsFormat(data.offBash_top)} date={data.offBash_date} />],
          ["defBashRank", <>{t("table.rank")} {t("table.bashDef")}</>, <TopElement val={nf.format(data.defBashRank_top)} date={data.defBashRank_date} />],
          ["defBash", <>{t("table.points")} {t("table.bashDef")}</>, <TopElement val={thousandsFormat(data.defBash_top)} date={data.defBash_date} />],
        ]} />
      </Row>
  )
};
