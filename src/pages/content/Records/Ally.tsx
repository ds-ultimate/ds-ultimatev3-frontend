import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useAllyData, useWorldData} from "../../../apiInterface/loadContent";
import {DecodeName} from "../../../util/UtilFunctions";
import {Card, Col, Nav, Row, Tab} from "react-bootstrap";
import ErrorPage from "../../layout/ErrorPage";
import AllyStatsPane from "./AllyStatsPane";
import AllyTopStatsPane from "./AllyTopStatsPane";
import {allyBasicDataType} from "../../../modelHelper/Ally";
import {worldType} from "../../../modelHelper/World";
import React from "react";
import AllyHistPane from "./AllyHistPane";
import {overviewMap} from "../../../apiInterface/apiConf";
import AllyCharts from "./AllyCharts";
import AllyPlayer from "./AllyPlayer";

export default function AllyPage() {
  const {server, world, ally} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const {t} = useTranslation("ui")
  const [allyErr, allyData] = useAllyData(server, world, ally)

  if(worldErr) return <ErrorPage error={worldErr} />
  if(allyErr) return <ErrorPage error={allyErr} />

  const name = allyData?.cur?.name ?? allyData?.top?.name ?? ""
  const tag = allyData?.cur?.tag ?? allyData?.top?.tag ?? ""

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-none d-lg-block"}>
            <h1 className={"fw-normal"}>
              {t("title.ally") + ": "}
              {allyData && <><DecodeName name={name} /> [<DecodeName name={tag} />]</>}
            </h1>
          </Col>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-lg-none"}>
            <h1 className={"fw-normal"}>
              {t("title.ally") + ": "}
            </h1>
            <h4>
              {allyData && <><DecodeName name={name} /><br />[<DecodeName name={tag} />]</>}
            </h4>
          </Col>
        </Col>
        <Col xs={12}>
          {allyData && (allyData.cur?
                  <ActiveAllyElement allyData={allyData} worldData={worldData} />:
                  <DeletedAllyElement allyData={allyData} worldData={worldData} />
          )}
        </Col>
      </Row>
  )
}

function DeletedAllyElement({allyData, worldData}: {allyData: allyBasicDataType, worldData: worldType | undefined}) {
  if(! allyData.top) return <ErrorPage error={"internalerr"} />
  return (
      <Card>
        <Card.Body>
          <AllyTopStatsPane data={allyData.top} worldData={worldData} conquer={allyData.conquer} allyChanges={allyData.changes}
                            exists={false} />
        </Card.Body>
      </Card>
  )
}

function ActiveAllyElement({allyData, worldData}: {allyData: allyBasicDataType, worldData: worldType | undefined}) {
  const {t} = useTranslation("ui")

  if(! allyData.cur) return <ErrorPage error={"internalerr"} />
  return (
      <>
        <StatsTabContainer allyData={allyData} worldData={worldData} />
        <AllyCharts allyData={allyData} worldData={worldData} />
        {worldData && <AllyPlayer ally_id={allyData.cur.allyID} worldData={worldData} />}
      </>
  )
}

function StatsTabContainer({allyData, worldData}: {allyData: allyBasicDataType, worldData: worldType | undefined}) {
  const {t} = useTranslation("ui")

  if(! allyData.cur) return <ErrorPage error={"internalerr"} />
  return (
      <Card>
        <Tab.Container defaultActiveKey={"stats"}>
          <Nav variant="tabs" defaultActiveKey="#stats">
            <Nav.Item>
              <Nav.Link eventKey={"stats"}>{t("nav.stats")}</Nav.Link>
            </Nav.Item>
            {allyData?.top && <Nav.Item>
              <Nav.Link eventKey={"tops"}>{t("nav.tops")}</Nav.Link>
            </Nav.Item>}
            <Nav.Item>
              <Nav.Link eventKey={"hist"}>{t("nav.history")}</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link eventKey={"map"}>{t("nav.map")}</Nav.Link>
            </Nav.Item>
          </Nav>
          <Card.Body>
            <Tab.Content>
              <Tab.Pane eventKey={"stats"}>
                <AllyStatsPane data={allyData.cur} worldData={worldData} conquer={allyData.conquer} allyChanges={allyData.changes} />
              </Tab.Pane>
              {allyData?.top && <Tab.Pane eventKey={"tops"}>
                <AllyTopStatsPane data={allyData.top} worldData={worldData} conquer={allyData.conquer} allyChanges={allyData.changes}
                                  exists={true} />
              </Tab.Pane>}
              <Tab.Pane eventKey={"hist"} mountOnEnter>
                {worldData && <AllyHistPane worldData={worldData} ally_id={allyData.cur.allyID}/>}
              </Tab.Pane>
              <Tab.Pane eventKey={"map"} mountOnEnter>
                {worldData && <img
                  src={overviewMap({server: worldData.server__code, world: worldData.name, type: "a", id: (allyData.cur.allyID + ""), ext: "png"})}
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
