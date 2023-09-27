import {useTranslation} from "react-i18next";
import {Card, Col, Row} from "react-bootstrap";

import {worldType} from "../../../../modelHelper/World";
import {DecodeName, thousandsFormat} from "../../../../util/UtilFunctions";

import {LinkVillageInGame, ResponsiveRecordTable} from "../Util";
import {LinkVillageConquer} from "./LinkVillageWinLoose";
import {
  LinkVillageOwner,
  villageBasicDataType,
  VillageBonusText,
  villageContinent,
  villageCoordinates,
} from "../../../../modelHelper/Village";

type paramType = {
  data: villageBasicDataType,
  worldData: worldType | undefined,
}

export default function VillageStatsPane({data, worldData}: paramType) {
  const {t} = useTranslation("ui")

  return (
      <Row>
        <Col xs={12} md={6}>
          <Card.Title as={"h4"}>{t("table-title.info")}</Card.Title>
        </Col>
        <Col xs={12} md={6}>
          <span className={"float-end"}>
            {worldData && <LinkVillageInGame worldData={worldData} village_id={data.data.villageID}>{t("inGame.normal")}</LinkVillageInGame>}
            {worldData && <LinkVillageInGame worldData={worldData} village_id={data.data.villageID} guestMode>{t("inGame.guest")}</LinkVillageInGame>}
          </span>
        </Col>
        <ResponsiveRecordTable title={t("table-title.general")} breakpoint={"lg"} tableData={[
          ["name", t("table.name"), <DecodeName name={data.data.name} />],
          ["points", t("table.points"), thousandsFormat(data.data.points)],
          ["continent", t("table.continent"), "K" + villageContinent(data.data)],
          ["coordinates", t("table.coordinates"), villageCoordinates(data.data)],
          ["owner", t("table.owner"), <>{worldData&& <LinkVillageOwner village={data.data} world={worldData} />}</>],
          ["conquer", t("table.conquer"), (worldData && <LinkVillageConquer village_id={data.data.villageID} world={worldData} conquer={data.conquer} />)],
          ["bonus", t("table.bonusType"), <VillageBonusText vil={data.data} />],
        ]} />
      </Row>
  )
}
