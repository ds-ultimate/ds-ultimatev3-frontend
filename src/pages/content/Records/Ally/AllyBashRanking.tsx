import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import React, {useEffect, useMemo} from "react";
import {useWorldData} from "../../../../apiInterface/loaders/world";
import ErrorPage from "../../../layout/ErrorPage";
import {DecodeName, nf, rawDecodeName, thousandsFormat} from "../../../../util/UtilFunctions";
import {allyPlayerTable} from "../../../../apiInterface/apiConf";
import {Card, Col, Row} from "react-bootstrap";
import DatatableBase, {DATATABLE_VARIANT, SORTING_DIRECTION} from "../../../../util/datatables/DatatableBase";
import {LinkPlayer, playerType} from "../../../../modelHelper/Player";
import DatatableHeaderBuilder from "../../../../util/datatables/DatatableHeaderBuilder";
import {filterPlayerCallback} from "./AllyPlayer";
import {allyType} from "../../../../modelHelper/Ally";
import {FrontendError} from "../../../layout/ErrorPages/ErrorTypes"
import {useAllyData} from "../../../../apiInterface/loaders/ally"

export default function AllyBashRankingPage() {
  const {server, world, ally} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const {t} = useTranslation("ui")
  const [allyErr, allyData] = useAllyData(server, world, ally)
  const playerHeader = useAllyBashRankingHeader(allyData?.cur)

  useEffect(() => {
    if(allyData?.cur?.name) {
      document.title = t("title.ally") + ": " + rawDecodeName(allyData.cur.name)
    } else if(allyData?.top?.name) {
      document.title = t("title.ally") + ": " + rawDecodeName(allyData.top.name)
    }
  }, [t, allyData])

  if(worldErr) return <ErrorPage error={worldErr} />
  if(allyErr) return <ErrorPage error={allyErr} />
  if(allyData?.top && allyData.cur === null) {
    const err: FrontendError = {
      isFrontend: true,
      code: 404,
      k: "404.allyDisbanded",
      p: {world: (server??"") + (world??""), ally: rawDecodeName(allyData.top.name)},
    }
    return <ErrorPage error={err} />
  }

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center d-none d-lg-block"}>
            <h1 className={"fw-normal"}>
              {t('title.ally')}: {allyData?.cur?.name && allyData?.cur?.tag && <>
                <DecodeName name={allyData.cur.name} />[<DecodeName name={allyData.cur.tag} />]
              </>}
            </h1>
          </Col>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center d-lg-none truncate"}>
            <h1 className={"fw-normal"}>
              {t('title.ally')}
            </h1>
            <h4>
              {allyData?.cur?.name && allyData?.cur?.tag && <>
                <DecodeName name={allyData.cur.name} />[<DecodeName name={allyData.cur.tag} />]
              </>}
            </h4>
          </Col>
        </Col>
        <Col xs={12} className={"mt-2"}>
          <Card>
            <Card.Body>
              {worldData && playerHeader && <DatatableBase<playerType>
                api={allyPlayerTable({server: worldData.server__code, world: worldData.name, ally: ally})}
                header={playerHeader}
                cells={[
                  (p) => nf.format(p.rank),
                  (p) => <>{worldData && <LinkPlayer player={p} world={worldData} />}</>,
                  (p) => thousandsFormat(p.gesBash),
                  (p) => thousandsFormat(p.offBash),
                  (p) => thousandsFormat(p.defBash),
                  (p) => thousandsFormat(p.supBash),
                  (p) => nf.format(round1(getPlayerKillPointPercent(p))) + " %",
                  (p) => <>{allyData?.cur && nf.format(round1(getPlayerKillPercent(p, allyData.cur)))} %</>,
                ]}
                cellClasses={["", "", "", "text-end", "text-end", "text-end", "text-end", "text-end"]}
                keyGen={p => p.playerID}
                variant={DATATABLE_VARIANT.CLIENT_SIDE}
                defaultSort={[2, SORTING_DIRECTION.DESC]}
                saveAs={'allyPlayerBashRanking'}
                responsiveTable
                searching={filterPlayerCallback}
              />}
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}

function useAllyBashRankingHeader(ally: allyType | null | undefined) {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    if(!ally) return null
    return new DatatableHeaderBuilder<playerType>()
        .addMainRow(row => {
          row.addCell({title: t('table.rank'),
            sortCB: ((data1, data2) => data1.rank - data2.rank)})
          row.addCell({title: t('table.name'),
            sortCB: ((data1, data2) => data1.name.localeCompare(data2.name))})
          row.addCell({sortDescDefault: true, title: t('table.bashGes'),
            sortCB: ((data1, data2) => data1.gesBash - data2.gesBash)})
          row.addCell({sortDescDefault: true, title: t('table.bashOff'),
            sortCB: ((data1, data2) => data1.offBash - data2.offBash)})
          row.addCell({sortDescDefault: true, title: t('table.bashDef'),
            sortCB: ((data1, data2) => data1.defBash - data2.defBash)})
          row.addCell({sortDescDefault: true, title: t('table.bashSup'),
            sortCB: ((data1, data2) => data1.supBash - data2.supBash)})
          row.addCell({sortDescDefault: true, title: t('table.playerPointPercent'),
            sortCB: ((data1, data2) => getPlayerKillPointPercent(data1) - getPlayerKillPointPercent(data2))})
          row.addCell({sortDescDefault: true, title: t('table.allyKillsPercent'),
            sortCB: ((data1, data2) => getPlayerKillPercent(data1, ally) - getPlayerKillPercent(data2, ally))})
        })
  }, [t, ally])
}

function round1(n: number) {
  return 0.1 * Math.round(n * 10)
}

function getPlayerKillPercent(player: playerType, ally: allyType) {
  return (player.gesBash === 0 || ally.gesBash === 0)?0:(100*player.gesBash/ally.gesBash)
}

function getPlayerKillPointPercent(player: playerType) {
  return (player.gesBash === 0 || player.points === 0)?0:(100*player.gesBash/player.points)
}
