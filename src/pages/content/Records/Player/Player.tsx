import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {usePlayerData, useWorldData, useWorldsOfServer} from "../../../../apiInterface/loadContent";
import {DecodeName} from "../../../../util/UtilFunctions";
import {Card, Col, Nav, Row, Tab} from "react-bootstrap";
import ErrorPage from "../../../layout/ErrorPage";
import PlayerStatsPane from "./PlayerStatsPane";
import PlayerTopStatsPane from "./PlayerTopStatsPane";
import {worldType} from "../../../../modelHelper/World";
import React from "react";
import PlayerHistPane from "./PlayerHistPane";
import {overviewMap} from "../../../../apiInterface/apiConf";
import PlayerCharts from "./PlayerCharts";
import PlayerVillages from "./PlayerVillages";
import {playerBasicDataType} from "../../../../modelHelper/Player";


export default function PlayerPage() {
  const {server, world, player} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const {t} = useTranslation("ui")
  const [playerErr, playerData] = usePlayerData(server, world, player)

  if(worldErr) return <ErrorPage error={worldErr} />
  if(playerErr) return <ErrorPage error={playerErr} />

  const name = playerData?.cur?.name ?? playerData?.top?.name ?? ""

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-none d-lg-block"}>
            <h1 className={"fw-normal"}>
              {t("title.player") + ": "}
              {playerData && <DecodeName name={name} />}
            </h1>
          </Col>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-lg-none"}>
            <h1 className={"fw-normal"}>
              {t("title.player") + ": "}
            </h1>
            <h4>
              {playerData && <DecodeName name={name} />}
            </h4>
          </Col>
        </Col>
        <Col xs={12}>
          {playerData && (playerData.cur?
                  <ActivePlayerElement playerData={playerData} worldData={worldData} />:
                  <DeletedPlayerElement playerData={playerData} worldData={worldData} />
          )}
        </Col>
      </Row>
  )
}

function DeletedPlayerElement({playerData, worldData}: {playerData: playerBasicDataType, worldData: worldType | undefined}) {
  const [serWorldsErr, serWorld] = useWorldsOfServer(worldData?.server__code)

  if(! playerData.top) return <ErrorPage error={"internalerr"} />
  if(serWorldsErr) return <ErrorPage error={serWorldsErr} />

  return (
      <Card>
        <Card.Body>
          <PlayerTopStatsPane data={playerData.top} worldData={worldData} conquer={playerData.conquer}
                              allyChanges={playerData.changes} otherServers={playerData.otherServers}
                              worlds={serWorld.worlds} exists={false} />
        </Card.Body>
      </Card>
  )
}

function ActivePlayerElement({playerData, worldData}: {playerData: playerBasicDataType, worldData: worldType | undefined}) {
  if(! playerData.cur) return <ErrorPage error={"internalerr"} />
  return (
      <>
        <StatsTabContainer playerData={playerData} worldData={worldData} />
        <PlayerCharts playerData={playerData} worldData={worldData} />
        {worldData && <PlayerVillages player_id={playerData.cur.playerID} worldData={worldData} />}
      </>
  )
}

function StatsTabContainer({playerData, worldData}: {playerData: playerBasicDataType, worldData: worldType | undefined}) {
  const {t} = useTranslation("ui")
  const [serWorldsErr, serWorld] = useWorldsOfServer(worldData?.server__code)

  if(serWorldsErr) return <ErrorPage error={serWorldsErr} />
  if(! playerData.cur) return <ErrorPage error={"internalerr"} />

  return (
      <Card>
        <Tab.Container defaultActiveKey={"stats"}>
          <Nav variant="tabs" defaultActiveKey="#stats">
            <Nav.Item>
              <Nav.Link eventKey={"stats"}>{t("nav.stats")}</Nav.Link>
            </Nav.Item>
            {playerData?.top && <Nav.Item>
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
                <PlayerStatsPane data={playerData.cur} worldData={worldData} conquer={playerData.conquer}
                                 allyChanges={playerData.changes} otherServers={playerData.otherServers} worlds={serWorld.worlds} />
              </Tab.Pane>
              {playerData?.top && <Tab.Pane eventKey={"tops"}>
                <PlayerTopStatsPane data={playerData.top} worldData={worldData} conquer={playerData.conquer}
                                    allyChanges={playerData.changes} otherServers={playerData.otherServers}
                                    worlds={serWorld.worlds} exists={true} />
              </Tab.Pane>}
              <Tab.Pane eventKey={"hist"} mountOnEnter>
                {worldData && <PlayerHistPane worldData={worldData} player_id={playerData.cur.playerID}/>}
              </Tab.Pane>
              <Tab.Pane eventKey={"map"} mountOnEnter>
                {worldData && <img
                  src={overviewMap({server: worldData.server__code, world: worldData.name, type: "p", id: (playerData.cur.playerID + ""), ext: "png"})}
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