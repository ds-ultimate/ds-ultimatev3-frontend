import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useVillageData, useWorldData} from "../../../../apiInterface/loadContent";
import {DecodeName} from "../../../../util/UtilFunctions";
import {Card, Col, Nav, Row, Tab} from "react-bootstrap";
import ErrorPage from "../../../layout/ErrorPage";
import {worldType} from "../../../../modelHelper/World";
import React from "react";
import {overviewMap} from "../../../../apiInterface/apiConf";
import {villageBasicDataType} from "../../../../modelHelper/Village";
import VillageStatsPane from "./VillageStatsPane";
import VillageHistory from "./VillageHistory";
import {ChartSection} from "../Util";


export default function VillagePage() {
  const {server, world, village} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const {t} = useTranslation("ui")
  const [villageErr, villageData] = useVillageData(server, world, village)

  if(worldErr) return <ErrorPage error={worldErr} />
  if(villageErr) return <ErrorPage error={villageErr} />

  const name = villageData?.data.name ?? ""

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-none d-lg-block"}>
            <h1 className={"fw-normal"}>
              {t("title.village") + ": "}
              {villageData && <DecodeName name={name} />}
            </h1>
          </Col>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-lg-none"}>
            <h1 className={"fw-normal"}>
              {t("title.village") + ": "}
            </h1>
            <h4>
              {villageData && <DecodeName name={name} />}
            </h4>
          </Col>
        </Col>
        <Col xs={12}>
          {villageData && <VillageElement villageData={villageData} worldData={worldData} />}
        </Col>
      </Row>
  )
}

function VillageElement({villageData, worldData}: {villageData: villageBasicDataType, worldData: worldType | undefined}) {
  const {t} = useTranslation("ui")

  return (
      <>
        <StatsTabContainer villageData={villageData} worldData={worldData} />
        <Row className={"justify-content-center"}>
          <ChartSection
              charts={[
                [false, villageData.history, t("chart.title.points")],
              ]}
              title={t('table-title.general')}
              single
          />
        </Row>
        {worldData && <VillageHistory villageData={villageData} worldData={worldData} />}
      </>
  )
}

function StatsTabContainer({villageData, worldData}: {villageData: villageBasicDataType, worldData: worldType | undefined}) {
  const {t} = useTranslation("ui")

  return (
      <Card>
        <Tab.Container defaultActiveKey={"stats"}>
          <Nav variant="tabs" defaultActiveKey="#stats">
            <Nav.Item>
              <Nav.Link eventKey={"stats"}>{t("nav.stats")}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"map"}>{t("nav.map")}</Nav.Link>
            </Nav.Item>
          </Nav>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey={"stats"}>
                <VillageStatsPane data={villageData} worldData={worldData} />
              </Tab.Pane>
              <Tab.Pane eventKey={"map"} mountOnEnter>
                {worldData && <img
                  src={overviewMap({server: worldData.server__code, world: worldData.name, type: "v", id: (villageData.data.villageID + ""), ext: "png"})}
                  alt={"[" + t("nav.map") + "]"}
                  className={"w-100"}
                />}
              </Tab.Pane>
            </Tab.Content>
          </Card.Body>
        </Tab.Container>
      </Card>
  )
}
