import {useTranslation} from "react-i18next";

import React, {useCallback, useMemo} from "react";
import DatatableHeaderBuilder from "../../../util/datatables/DatatableHeaderBuilder";
import {Card, Col, Row} from "react-bootstrap";
import {LinkPlayer, LinkPlayerAlly, playerType} from "../../../modelHelper/Player";
import DatatableBase, {SORTING_DIRECTION} from "../../../util/datatables/DatatableBase";
import {nf, thousandsFormat} from "../../../util/UtilFunctions";
import {allyPlayerTable} from "../../../apiInterface/apiConf";
import {worldType} from "../../../modelHelper/World";

type paramType = {
  ally_id: number,
  worldData: worldType,
}

export default function AllyPlayer({ally_id, worldData}: paramType) {
  const {t} = useTranslation("ui")
  const playerHeader = useAllyPlayerHeader()

  return (
      <Row className={"justify-content-center"}>
        <Col xs={12} className={"mt-3"}>
          <Card>
            <Card.Body>
              <Card.Title as={"h4"}>{t("table-title.player")}</Card.Title>
              <DatatableBase<playerType>
                  api={allyPlayerTable({server: worldData.server__code, world: worldData.name, ally: (ally_id + "")})}
                  header={playerHeader}
                  cells={[
                    (p) => nf.format(p.rank),
                    (p) => <>{worldData && <LinkPlayer player={p} world={worldData} />}</>,
                    (p) => <>{worldData && <LinkPlayerAlly player={p} world={worldData} />}</>,
                    (p) => thousandsFormat(p.points),
                    (p) => nf.format(p.village_count),
                    (p) => nf.format((p.village_count === 0)?(0):(p.points / p.village_count)),
                    (p) => thousandsFormat(p.gesBash),
                    (p) => thousandsFormat(p.offBash),
                    (p) => thousandsFormat(p.defBash),
                    (p) => thousandsFormat(p.supBash),
                  ]}
                  cellClasses={["", "", "", "text-end", "text-end", "", "text-end", "text-end", "text-end", "text-end"]}
                  keyGen={p => p.playerID}
                  serverSide={false}
                  defaultSort={[0, SORTING_DIRECTION.ASC]}
                  saveAs={'allyPlayer'}
                  responsiveTable
                  searching={filterPlayerCallback}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}

function filterPlayerCallback(c: playerType, search: string) {
  return c.name.includes(search) ||
      (c.allyLatest__name !== null && c.allyLatest__name.includes(search)) ||
      (c.allyLatest__tag !== null && c.allyLatest__tag.includes(search))
}

function useAllyPlayerHeader() {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder<playerType>()
        .addRow(row => {
          row.addCell({colSpan: 6, useConcat: false, title: t('table-title.general')})
          row.addCell({colSpan: 4, title: t('table-title.bashStats')})
        })
        .addMainRow(row => {
          row.addCell({title: t('table.rank'),
            sortCB: ((data1, data2) => data1.rank - data2.rank)})
          row.addCell({title: t('table.name'),
            sortCB: ((data1, data2) => data1.name.localeCompare(data2.name))})
          row.addCell({title: t('table.ally')})
          row.addCell({sortDescDefault: true, title: t('table.points'),
            sortCB: ((data1, data2) => data1.points - data2.points)})
          row.addCell({sortDescDefault: true, title: t('table.villages'),
            sortCB: ((data1, data2) => data1.village_count - data2.village_count)})
          row.addCell({showAt: "md", title: t('table.avgVillage')})
          row.addCell({showAt: "lg", sortDescDefault: true, title: t('table.bashGes'),
            sortCB: ((data1, data2) => data1.gesBash - data2.gesBash)})
          row.addCell({showAt: "lg", sortDescDefault: true, title: t('table.bashOff'),
            sortCB: ((data1, data2) => data1.offBash - data2.offBash)})
          row.addCell({showAt: "lg", sortDescDefault: true, title: t('table.bashDef'),
            sortCB: ((data1, data2) => data1.defBash - data2.defBash)})
          row.addCell({showAt: "lg", sortDescDefault: true, title: t('table.bashSup'),
            sortCB: ((data1, data2) => data1.supBash - data2.supBash)})
        })
  }, [t])
}
