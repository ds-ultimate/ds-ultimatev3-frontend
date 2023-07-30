import {Link, useParams} from "react-router-dom";
import {useState} from "react";
import {WorldDisplayName, WorldState, worldType} from "../../modelHelper/World";
import {ServerFlag, serverType} from "../../modelHelper/Server";
import {useWorldsOfServer} from "../../apiInterface/loadContent";
import {useTranslation} from "react-i18next";
import {formatRoute} from "../../util/router";
import {WORLD, WORLD_ALLY_CUR, WORLD_PLAYER_CUR} from "../../util/routes";
import {nf} from "../../util/UtilFunctions";
import {Button, Card, Col, Row, Table} from "react-bootstrap";

import styles from "./Server.module.scss"
import ErrorPage from "../layout/ErrorPage";

function WorldTypeSection({data, header, server, type}: {data: worldType[], header: string, server?: serverType, type: string}) {
  const { t } = useTranslation("ui")
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const activeData = data.filter(w => w.active)
  const inactiveData = data.filter(w => !w.active)

  return (
      <Col xs={12} lg={6} className={"mt-2"}>
        <Card>
          <Card.Body>
            {activeData.length > 0 &&
              <>
                <Card.Title as={"h2"}>{header}:</Card.Title>
                <WorldTable data={activeData} server={server}/>
              </>
            }
            {inactiveData.length > 0 &&
              <>
                <Col xs={12} className={"text-center my-3"}>
                  <Button variant={"secondary"} className={"btn-sm"}
                          aria-controls={type + "-inactive-col"} aria-expanded={isOpen}
                          onClick={() => setIsOpen((old_open) => !old_open)}
                  >{t('showMoreWorlds')}</Button>
                </Col>
                {isOpen &&
                  <div id={type + "-inactive-col"}>
                    <Card.Title as={"h2"}>{header + ' ' + t('archive')}:</Card.Title>
                    <WorldTable data={inactiveData} server={server}/>
                  </div>
                }
              </>
            }
          </Card.Body>
        </Card>
      </Col>
  )
}

function WorldTable({data, server}: {data: worldType[], server?: serverType}) {
  const { t } = useTranslation("ui")
  return (
      <Table striped hover className={"nowrap w-100"}>
        <thead>
        <tr>
          <th>{t('table.world')}</th>
          <th>{t('table.player')}</th>
          <th>{t('table.ally')}</th>
          <th>{t('table.village')}</th>
        </tr>
        </thead>
        <tbody>
        {data.map(w => {
          return (
              <tr key={w.server__code + w.name}>
                <td className={styles.serverTruncate}>
                  {server && (<ServerFlag server={server} />)}
                  <Link to={formatRoute(WORLD, {server: w.server__code, world: w.name})}><WorldDisplayName world={w} /></Link>
                  <small className={"text-muted"}>({w.server__code + w.name})</small>
                  <WorldState world={w} />{/* TODO worldstate only for admins? */}
                </td>
                <td><Link to={formatRoute(WORLD_PLAYER_CUR, {server: w.server__code, world: w.name})}>
                  {nf.format(w.player_count)}
                </Link></td>
                <td><Link to={formatRoute(WORLD_ALLY_CUR, {server: w.server__code, world: w.name})}>
                  {nf.format(w.ally_count)}
                </Link></td>
                <td>{nf.format(w.village_count)}</td>
              </tr>
          )
        })}
        </tbody>
      </Table>
  )
}

export default function ServerPage() {
  const {server} = useParams()
  const [serverErr, serverWorlds] = useWorldsOfServer(server)
  const { t } = useTranslation("ui")

  if(serverErr) return <ErrorPage error={serverErr} />

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center"}>
            <h1 className={"fw-normal"}>{t('title.worldOverview')}</h1>
          </Col>
        </Col>
        <WorldTypeSection
            data={serverWorlds.worlds.filter(w => w.sortType === "world").sort((w1, w2) => parseInt(w2.name) - parseInt(w1.name))}
            header={t('table-title.normalWorlds')}
            server={serverWorlds.server}
            type={"normal"}
        />
        <WorldTypeSection
            data={serverWorlds.worlds.filter(w => w.sortType !== "world").sort((w1, w2) => w2.id - w1.id)}
            header={t('table-title.specialWorlds')}
            server={serverWorlds.server}
            type={"special"}
        />
      </Row>
  )
};
