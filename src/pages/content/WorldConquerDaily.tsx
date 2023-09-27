import {Link, useParams} from "react-router-dom";
import {Card, Col, Row} from "react-bootstrap";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useExtendedWorldData, useWorldData} from "../../apiInterface/loaders/world"
import {WorldDisplayName, worldDisplayNameRaw, worldType} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import ErrorPage from "../layout/ErrorPage";
import DatePicker from "react-datepicker";
import useDatepickerLanguage from "../../util/datepickerLanguage";
import DatatableBase, {DATATABLE_VARIANT} from "../../util/datatables/DatatableBase";
import {worldDailyAllyConquerTable, worldDailyPlayerConquerTable} from "../../apiInterface/apiConf";
import {DecodeName, nf} from "../../util/UtilFunctions";
import {formatRoute} from "../../util/router";
import {ALLY_INFO, PLAYER_INFO} from "../../util/routes";
import DatatableHeaderBuilder from "../../util/datatables/DatatableHeaderBuilder";


type conquerDailyPlayerType = {
  rank: number,
  playerID: number,
  name: string,
  ally_id: number,
  ally_tag: string,
  ally_name: string,
  count: number,
}

type conquerDailyAllyType = {
  rank: number,
  allyID: number,
  tag: string,
  name: string,
  count: number,
}

function PlayerLink({data, world}: {data: conquerDailyPlayerType, world: worldType}) {
  return (
      <Link to={formatRoute(PLAYER_INFO, {server: world.server__code, world: world.name, player: (data.playerID + "")})}>
        <DecodeName name={data.name} />
      </Link>
  )
}

function PlayerAllyLink({data, world}: {data: conquerDailyPlayerType, world: worldType}) {
  return (
      <>
        {data.ally_tag?(
            <Link to={formatRoute(ALLY_INFO, {server: world.server__code, world: world.name, ally: (data.ally_id + "")})}>
              {" "}[<DecodeName name={data.ally_tag} />]
            </Link>
        ):"-"}
      </>
  )
}

function AllyLink({data, world, useTag}: {data: conquerDailyAllyType, world: worldType, useTag?: boolean}) {
  return (
      <>
        <Link to={formatRoute(ALLY_INFO, {server: world.server__code, world: world.name, ally: (data.allyID + "")})}>
          {useTag?(
              <DecodeName name={data.tag} />
          ):(
              <DecodeName name={data.name} />
          )}
        </Link>
      </>
  )
}

function usePlayerDailyConquerHeader() {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder<conquerDailyPlayerType>()
        .addMainRow(row => {
          row.addCell({title: ""})
          row.addCell({title: t('table.name')})
          row.addCell({title: t('table.ally')})
          row.addCell({title: t('table.total')})
        })
  }, [t])
}

function useAllyDailyConquerHeader() {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder<conquerDailyAllyType>()
        .addMainRow(row => {
          row.addCell({title: ""})
          row.addCell({title: t('table.ally')})
          row.addCell({title: t('table.tag')})
          row.addCell({title: t('table.total')})
        })
  }, [t])
}

export default function WorldConquerDailyPage() {
  const {t} = useTranslation("ui")
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const [worldExtErr, extendedWorldData] = useExtendedWorldData(server, world)
  const wName = worldData && <WorldDisplayName world={worldData} />
  const datepickerLang = useDatepickerLanguage()
  const today = new Date()
  const [dateToShow, setDateToShow] = useState(today)
  const playerHeader = usePlayerDailyConquerHeader()
  const allyHeader = useAllyDailyConquerHeader()
  const filterPlayerCallback = useCallback((c: conquerDailyPlayerType, search: string) => {
    return c.name.includes(search) || c.ally_name.includes(search) || c.ally_tag.includes(search)
  }, [])
  const filterAllyCallback = useCallback((c: conquerDailyAllyType, search: string) => {
    return c.name.includes(search) || c.tag.includes(search)
  }, [])

  useEffect(() => {
    if(worldData) {
      document.title = worldDisplayNameRaw(t, worldData) + ": " + t("conquer.daily")
    }
  }, [t, worldData])

  if(worldErr) return <ErrorPage error={worldErr} />
  if(worldExtErr) return <ErrorPage error={worldExtErr} />

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center d-none d-lg-block"}>
            <h1 className={"fw-normal"}>
              {wName}: {t("conquer.daily")}
            </h1>
          </Col>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center d-lg-none truncate"}>
            <h1 className={"fw-normal"}>
              {wName}
            </h1>
            <h4>
              {t("conquer.daily")}
            </h4>
          </Col>
        </Col>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row>
                <Col xs={"auto"} className={"ms-auto me-auto text-center"}>
                  <DatePicker
                      selected={dateToShow}
                      onChange={(date) => date?setDateToShow(date):undefined}
                      minDate={extendedWorldData?(new Date(extendedWorldData.firstConquer*1000)):new Date()}
                      maxDate={today}
                      className={"form-control"}
                      dateFormat={datepickerLang.formatLong?.date()}
                      locale={datepickerLang}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6} className={"mt-2"}>
          <Card>
            <Card.Body>
              <Card.Title>{t("table-title.player")}</Card.Title>
              <DatatableBase<conquerDailyPlayerType>
                  header={playerHeader}
                  saveAs={"playerDailyConquer"}
                  api={worldDailyPlayerConquerTable({server, world})}
                  cells={[
                    (c) => nf.format(c.rank),
                    (c) => <>{worldData && <PlayerLink data={c} world={worldData} />}</>,
                    (c) => <>{worldData && <PlayerAllyLink data={c} world={worldData} />}</>,
                    (c) => nf.format(c.count),
                  ]}
                  keyGen={(c) => c.playerID}
                  responsiveTable
                  variant={DATATABLE_VARIANT.CLIENT_SIDE}
                  striped
                  searching={filterPlayerCallback}
                  api_params={{date: `${dateToShow.getFullYear()}-${dateToShow.getMonth()}-${dateToShow.getDate()}`}}
                  />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} lg={6} className={"mt-2"}>
          <Card>
            <Card.Body>
              <Card.Title>{t("table-title.allys")}</Card.Title>
              <DatatableBase<conquerDailyAllyType>
                  header={allyHeader}
                  saveAs={"allyDailyConquer"}
                  api={worldDailyAllyConquerTable({server, world})}
                  cells={[
                    (c) => nf.format(c.rank),
                    (c) => <>{worldData && <AllyLink data={c} world={worldData} />}</>,
                    (c) => <>{worldData && <AllyLink data={c} world={worldData} useTag />}</>,
                    (c) => nf.format(c.count),
                  ]}
                  keyGen={(c) => c.allyID}
                  responsiveTable
                  variant={DATATABLE_VARIANT.CLIENT_SIDE}
                  striped
                  searching={filterAllyCallback}
                  api_params={{date: `${dateToShow.getFullYear()}-${dateToShow.getMonth()}-${dateToShow.getDate()}`}}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
};
