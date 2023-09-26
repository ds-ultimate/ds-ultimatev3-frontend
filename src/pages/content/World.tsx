import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {LinkPlayer, playerType} from "../../modelHelper/Player";
import {allyType, LinkAlly} from "../../modelHelper/Ally";
import {useWorldOverview} from "../../apiInterface/loadContent";
import {WorldDisplayName, worldType} from "../../modelHelper/World";
import {nf, thousandsFormat} from "../../util/UtilFunctions";
import {Card, Col, Row, Table} from "react-bootstrap";

import styles from "./World.module.scss"
import ErrorPage from "../layout/ErrorPage";
import {useWorldData} from "../../apiInterface/loaders/world"

function WorldPlayerTable({worldData, worldPlayerData}: {worldData?: worldType, worldPlayerData: playerType[]}) {
  const { t } = useTranslation("ui")
  return (
      <Card.Body className={"table-responsive"}>
        <Card.Title as={"h2"}>{t('table-title.top10') + " " + t('table-title.player')}</Card.Title>
        <Table hover striped className={"table-responsive w-100 " + styles.playerTable}>
          <thead>
          <tr>
            <th>{t('table.rank')}</th>
            <th>{t('table.name')}</th>
            <th>{t('table.points')}</th>
            <th>{t('table.villages')}</th>
          </tr>
          </thead>
          <tbody>
          {worldData && worldPlayerData.map(p => {
            return (
                <tr key={p.playerID}>
                  <th>{nf.format(p.rank)}</th>
                  <td><LinkPlayer player={p} world={worldData} withAlly /></td>
                  <td>{thousandsFormat(p.points)}</td>
                  <td>{nf.format(p.village_count)}</td>
                </tr>
            )
          })}
          </tbody>
        </Table>
      </Card.Body>
  )
}

function WorldAllyTable({worldData, worldAllyData}: {worldData?: worldType, worldAllyData: allyType[]}) {
  const { t } = useTranslation("ui")
  return (
      <Card.Body className={"table-responsive"}>
        <Card.Title as={"h2"}>{t('table-title.top10') + " " + t('table-title.allys')}</Card.Title>
        <Table hover striped className={"table-responsive w-100 " + styles.playerTable}>
          <thead>
          <tr>
            <th>{t('table.rank')}</th>
            <th>{t('table.name')}</th>
            <th>{t('table.tag')}</th>
            <th>{t('table.points')}</th>
            <th>{t('table.members')}</th>
            <th>{t('table.villages')}</th>
          </tr>
          </thead>
          <tbody>
          {worldData && worldAllyData.map(a => {
            return (
                <tr key={a.allyID}>
                  <th>{nf.format(a.rank)}</th>
                  <td><LinkAlly ally={a} world={worldData} /></td>
                  <td><LinkAlly ally={a} world={worldData} useTag /></td>
                  <td>{thousandsFormat(a.points)}</td>
                  <td>{nf.format(a.member_count)}</td>
                  <td>{nf.format(a.village_count)}</td>
                </tr>
            )
          })}
          </tbody>
        </Table>
      </Card.Body>
  )
}

export default function WorldPage() {
  const {server, world} = useParams()
  const [worldOverviewErr, worldOverview] = useWorldOverview(server, world)
  const [worldErr, worldData] = useWorldData(server, world)

  if(worldOverviewErr) return <ErrorPage error={worldOverviewErr} />
  if(worldErr) return <ErrorPage error={worldErr} />

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center"}>
            <h1 className={"fw-normal"}>{worldData && <WorldDisplayName world={worldData} />}</h1>
          </Col>
        </Col>
        <Col xs={12} lg={6} className={"mt-2"}>
          <Card>
              <WorldPlayerTable worldData={worldData} worldPlayerData={worldOverview.player} />
          </Card>
        </Col>
        <Col xs={12} lg={6} className={"mt-2"}>
          <Card>
              <WorldAllyTable worldData={worldData} worldAllyData={worldOverview.ally} />
          </Card>
        </Col>
      </Row>
  )
};
