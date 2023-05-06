import {useTranslation} from "react-i18next";
import {Card, Col, Row} from "react-bootstrap";

import {playerTopType} from "../../../../modelHelper/Player";
import {worldType} from "../../../../modelHelper/World";

import {LinkPlayerInGame, ResponsiveMultiRecordTable, ResponsiveRecordTable, TopElement} from "../Util";
import {DecodeName, nf, thousandsFormat} from "../../../../util/UtilFunctions";
import {LinkPlayerAllyChanges, LinkPlayerConquer} from "./LinkPlayerWinLoose";
import {OtherWorldElement} from "./PlayerStatsPane";
import PlayerSignature from "./PlayerSignature";

type paramType = {
  data: playerTopType,
  worldData: worldType | undefined,
  conquer: {
    old: number,
    new: number,
    own: number,
    total: number,
  },
  allyChanges: {
    total: number,
  },
  otherServers: number[], //world IDs
  worlds: worldType[],
  exists: boolean,
}

export default function PlayerTopStatsPane({data, worldData, conquer, allyChanges, otherServers, worlds, exists}: paramType) {
  const {t} = useTranslation("ui")

  return (
      <Row>
        <Col xs={12} md={6}>
          <Card.Title as={"h4"}>{t("table-title.info")}</Card.Title>
        </Col>
        <Col xs={12} md={6}>
          {exists && <span className={"float-end"}>
            {worldData && <LinkPlayerInGame worldData={worldData} player_id={data.playerID}>{t("inGame.normal")}</LinkPlayerInGame>}
            {worldData && <LinkPlayerInGame worldData={worldData} player_id={data.playerID} guestMode>{t("inGame.guest")}</LinkPlayerInGame>}
          </span>}
        </Col>
        <ResponsiveRecordTable title={t("table-title.general")} breakpoint={"lg"} tableData={[
          ["rank", t("table.rank"), <TopElement val={nf.format(data.rank_top)} date={data.rank_date} bp={"lg"} />],
          ["name", t("table.name"), <DecodeName name={data.name} />],
          ["points", t("table.points"), <TopElement val={thousandsFormat(data.points_top)} date={data.points_date} bp={"lg"} />],
          ["villages", t("table.villages"), <TopElement val={nf.format(data.village_count_top)} date={data.village_count_date} bp={"lg"} />],
          ["avgVillage", t("table.avgVillage"), data.village_count_top !== 0?nf.format(Math.round(data.points_top / data.village_count_top)):"-"],
          ["conquer", t("table.conquer"), (worldData && <LinkPlayerConquer player_id={data.playerID} world={worldData} conquer={conquer} />)],
          ["allyChanges", t("table.allyChanges"), (worldData && <LinkPlayerAllyChanges player_id={data.playerID} world={worldData} allyChanges={allyChanges} />)],
        ]} />
        <ResponsiveMultiRecordTable breakpoint={"lg"} title={
          <>
            {t("table-title.bashStats")}
          </>
        } tableData={[
          [
            {
              header: <>{t("table-title.bashStats")} - {t("table.bashGes")}</>,
              columns: [
                ["gesBashRank", <>{t("table.rank")}</>, <TopElement val={nf.format(data.gesBashRank_top)} date={data.gesBashRank_date} bp={"lg"} />],
                ["gesBash", <>{t("table.points")}</>, <TopElement val={thousandsFormat(data.gesBash_top)} date={data.gesBash_date} bp={"lg"} />],
                ["gesBashRatio", t("table.bashPointsRatio"), <>{data.points_top !== 0?nf.format(Math.round(100 * data.gesBash_top / data.points_top)):"-"}%</>],
              ]
            },
            {
              header: <>{t("table-title.bashStats")} - {t("table.bashOff")}</>,
              columns: [
                ["offBashRank", <>{t("table.rank")}</>, <TopElement val={nf.format(data.offBashRank_top)} date={data.offBashRank_date} bp={"lg"} />],
                ["offBash", <>{t("table.points")}</>, <TopElement val={thousandsFormat(data.offBash_top)} date={data.offBash_date} bp={"lg"} />],
                ["offBashRatio", t("table.bashPointsRatio"), <>{data.points_top !== 0?nf.format(Math.round(100 * data.offBash_top / data.points_top)):"-"}%</>],
              ]
            },
          ],
          [
            {
              header: <>{t("table-title.bashStats")} - {t("table.bashDef")}</>,
              columns: [
                ["defBashRank", <>{t("table.rank")}</>, <TopElement val={nf.format(data.defBashRank_top)} date={data.defBashRank_date} bp={"lg"} />],
                ["defBash", <>{t("table.points")}</>, <TopElement val={thousandsFormat(data.defBash_top)} date={data.defBash_date} bp={"lg"} />],
                ["defBashRatio", t("table.bashPointsRatio"), <>{data.points_top !== 0?nf.format(Math.round(100 * data.defBash_top / data.points_top)):"-"}%</>],
              ]
            },
            {
              header: <>{t("table-title.bashStats")} - {t("table.bashSup")}</>,
              columns: [
                ["supBashRank", <>{t("table.rank")}</>, <TopElement val={nf.format(data.supBashRank_top)} date={data.supBashRank_date} bp={"lg"} />],
                ["supBash", <>{t("table.points")}</>, <TopElement val={thousandsFormat(data.supBash_top)} date={data.supBash_date} bp={"lg"} />],
                ["supBashRatio", t("table.bashPointsRatio"), <>{data.points_top !== 0?nf.format(Math.round(100 * data.supBash_top / data.points_top)):"-"}%</>],
              ]
            },
          ],
        ]} />
        {otherServers.length > 0 && <Col xs={12} className={"mt-3 mb-3"}>
          <Card.Title as={"h4"}>{t('otherWorldsPlayer')}</Card.Title>
          {otherServers.map(value => (
              <OtherWorldElement key={value} world={worlds.find(w_val => w_val.id === value)} player_id={data.playerID} />
          ))}
        </Col>}
        <Col>
          {worldData && <PlayerSignature worldData={worldData} player_id={data.playerID}/>}
        </Col>
      </Row>
  )
};
