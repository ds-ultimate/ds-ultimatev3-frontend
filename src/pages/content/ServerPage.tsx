import {Link, useParams} from "react-router-dom";
import {useCallback, useEffect, useMemo, useState} from "react";
import {WorldDisplayName, worldDisplayNameRaw, WorldState, worldType} from "../../modelHelper/World";
import {ServerFlag, serverType} from "../../modelHelper/Server";
import {useWorldsOfServer} from "../../apiInterface/loaders/world"
import {useTranslation} from "react-i18next";
import {formatRoute} from "../../util/router";
import {WORLD, WORLD_ALLY_CUR, WORLD_PLAYER_CUR} from "../routes";
import {nf} from "../../util/UtilFunctions";
import {Button, Card, Col, Row, Table} from "react-bootstrap";

import styles from "./ServerPage.module.scss"
import ErrorPage from "../layout/ErrorPage";
import {useServer} from "../../apiInterface/loaders/server"
import DatatableHeaderBuilder from "../../util/datatables/DatatableHeaderBuilder"
import DatatableBase, {DATATABLE_VARIANT} from "../../util/datatables/DatatableBase"

function WorldTypeSection({data, header, server, type}: {data: worldType[], header: string, server?: serverType, type: string}) {
  const { t } = useTranslation("ui")
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const activeData = useMemo(() => {
    return data.filter(w => w.active)
  }, [data])

  const inactiveData = useMemo(() => {
    return data.filter(w => !w.active)
  }, [data])

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
                    <WorldTableDatatable data={inactiveData} server={server}/>
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
                  <WorldState world={w} />
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

function useWorldTableDatatableHeader() {
  const { t } = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder<worldType>()
        .addMainRow(row => {
          row.addCell({sortDescDefault: true, title: t('table.world'),
            sortCB: (data1, data2) => data1.name.localeCompare(data2.name)})
          row.addCell({sortDescDefault: true, title: t('table.player'),
            sortCB: (data1, data2) => data1.player_count - data2.player_count})
          row.addCell({sortDescDefault: true, title: t('table.ally'),
            sortCB: (data1, data2) => data1.ally_count - data2.ally_count})
          row.addCell({sortDescDefault: true, title: t('table.village'),
            sortCB: (data1, data2) => data1.village_count - data2.village_count})
        })
  }, [t])
}

function useFilterWorldsCallback() {
  const { t } = useTranslation("ui")
  return useCallback((w: worldType, search: string) => {
    return w.name.includes(search) ||
        worldDisplayNameRaw(t, w).includes(search)
  }, [t])
}

function WorldTableDatatable({data, server}: {data: worldType[], server?: serverType}) {
  const header = useWorldTableDatatableHeader()
  const filterWorldsCallback = useFilterWorldsCallback()
  return (
      <DatatableBase<worldType>
          data={data}
          header={header}
          cells={[
            (w) => <>
                {server && (<ServerFlag server={server} />)}
                <Link to={formatRoute(WORLD, {server: w.server__code, world: w.name})}><WorldDisplayName world={w} /></Link>
                <small className={"text-muted"}>({w.server__code + w.name})</small>
                <WorldState world={w} />
              </>,
            (w) => <Link to={formatRoute(WORLD_PLAYER_CUR, {server: w.server__code, world: w.name})}>
              {nf.format(w.player_count)}
            </Link>,
            (w) => <Link to={formatRoute(WORLD_ALLY_CUR, {server: w.server__code, world: w.name})}>
              {nf.format(w.ally_count)}
            </Link>,
            (w) => nf.format(w.village_count),
          ]}
          cellClasses={[styles.serverTruncate, "", "", ""]}
          keyGen={w => w.server__code + w.name}
          variant={DATATABLE_VARIANT.DATA}
          saveAs={'serverWorldOverview'}
          responsiveTable
          searching={filterWorldsCallback}
      />
  )
}

export default function ServerPage() {
  const {server} = useParams()
  const [serverErr, serverData] = useServer(server)
  const [serverWorldsErr, serverWorlds] = useWorldsOfServer(server)
  const { t } = useTranslation("ui")

  const normalWorlds = useMemo(() => {
    if(serverWorlds === undefined) return []
    return serverWorlds.filter(w => w.sortType === "world").sort((w1, w2) => parseInt(w2.name) - parseInt(w1.name))
  }, [serverWorlds])

  const specialWorlds = useMemo(() => {
    if(serverWorlds === undefined) return []
    return serverWorlds.filter(w => w.sortType !== "world").sort((w1, w2) => w2.id - w1.id)
  }, [serverWorlds])

  useEffect(() => {
    document.title = t("title.worldOverview")
  }, [t])

  if(serverErr) return <ErrorPage error={serverErr} />
  if(serverWorldsErr) return <ErrorPage error={serverWorldsErr} />

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center"}>
            <h1 className={"fw-normal"}>{t('title.worldOverview')}</h1>
          </Col>
        </Col>
        <WorldTypeSection
            data={normalWorlds}
            header={t('table-title.normalWorlds')}
            server={serverData}
            type={"normal"}
        />
        <WorldTypeSection
            data={specialWorlds}
            header={t('table-title.specialWorlds')}
            server={serverData}
            type={"special"}
        />
      </Row>
  )
};
