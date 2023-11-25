import {useTranslation} from "react-i18next";

import {worldType} from "../../../../modelHelper/World";
import {dateFormatLocal_DMY, dateFormatYMD, DecodeName, ShowHistory} from "../../../../util/UtilFunctions";
import React, {useMemo} from "react";
import DatatableHeaderBuilder from "../../../../util/datatables/DatatableHeaderBuilder";
import DatatableBase, {DATATABLE_VARIANT, SORTING_DIRECTION} from "../../../../util/datatables/DatatableBase";
import {playerPlayerHistoryTable} from "../../../../apiInterface/apiConf";
import {Card, Col, Row} from "react-bootstrap";
import {LinkPlayerInGame} from "../Util";
import {LinkPlayerAlly, playerType} from "../../../../modelHelper/Player";

type paramType = {
  player_id: number,
  worldData: worldType,
}

type playerHistoryType = {
  cur: playerType,
  last: playerType | null,
  date: string,
}

export default function PlayerHistPane({player_id, worldData}: paramType) {
  const {t} = useTranslation("ui")
  const histHeader = usePlayerHistoryHeader()

  return (
      <Row>
        <Col xs={12} md={6}>
          <Card.Title as={"h4"}>{t("table-title.playerHist")}</Card.Title>
        </Col>
        <Col xs={12} md={6}>
          <span className={"float-end"}>
            {worldData && <LinkPlayerInGame worldData={worldData} player_id={player_id}>{t("inGame.normal")}</LinkPlayerInGame>}
            {worldData && <LinkPlayerInGame worldData={worldData} player_id={player_id} guestMode>{t("inGame.guest")}</LinkPlayerInGame>}
          </span>
        </Col>
        <Col xs={12}>
          <DatatableBase<playerHistoryType>
              header={histHeader}
              saveAs={"playerHistory"}
              api={playerPlayerHistoryTable({server: worldData.server__code, world: worldData.name, player: (player_id + "")})}
              cells={[
                (p) => dateFormatLocal_DMY(new Date(p.date)),
                (p) => <DecodeName name={p.cur.name} />,
                (p) => <LinkPlayerAlly player={p.cur} world={worldData} /> ,
                (p) => <ShowHistory name={t('table.rank')} o_dat={p.last?.rank} n_dat={p.cur.rank} invert />,
                (p) => <ShowHistory name={t('table.points')} o_dat={p.last?.points} n_dat={p.cur.points} tsd_format />,
                (p) => <ShowHistory name={t('table.villages')} o_dat={p.last?.village_count} n_dat={p.cur.village_count} />,
                (p) => <ShowHistory name={t('table.bashAllS')} o_dat={p.last?.gesBash} n_dat={p.cur.gesBash} tsd_format />,
                (p) => <ShowHistory name={t('table.bashAttS')} o_dat={p.last?.offBash} n_dat={p.cur.offBash} tsd_format />,
                (p) => <ShowHistory name={t('table.bashDefS')} o_dat={p.last?.defBash} n_dat={p.cur.defBash} tsd_format />,
                (p) => <ShowHistory name={t('table.bashSupS')} o_dat={p.last?.gesBash} n_dat={p.cur.gesBash} tsd_format />,
              ]}
              keyGen={(c) => dateFormatYMD(new Date(c.date))}
              responsiveTable
              variant={DATATABLE_VARIANT.CLIENT_SIDE}
              defaultSort={[0, SORTING_DIRECTION.DESC]}
              striped
          />
        </Col>
      </Row>
  )
}

function usePlayerHistoryHeader() {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder<playerHistoryType>()
        .addMainRow(row => {
          row.addCell({title: t('table.date'), sortDescDefault: true,
            sortCB: (data1, data2) => {
              const d1 = new Date(data1.date)
              const d2 = new Date(data2.date)
              return d1.getTime() - d2.getTime()
            }})
          row.addCell({showAt: "lg", title: t('table.player')})
          row.addCell({showAt: "lg", title: t('table.ally')})
          row.addCell({title: t('table.rank'),
            sortCB: ((data1, data2) => data1.cur.rank - data2.cur.rank)})
          row.addCell({title: t('table.points'), sortDescDefault: true,
            sortCB: ((data1, data2) => data1.cur.points - data2.cur.points)})
          row.addCell({title: t('table.villages'), sortDescDefault: true,
            sortCB: ((data1, data2) => data1.cur.village_count - data2.cur.village_count)})
          row.addCell({title: t('table.bashAllS'), sortDescDefault: true,
            sortCB: ((data1, data2) => data1.cur.gesBash - data2.cur.gesBash)})
          row.addCell({title: t('table.bashAttS'), sortDescDefault: true,
            sortCB: ((data1, data2) => data1.cur.offBash - data2.cur.offBash)})
          row.addCell({title: t('table.bashDefS'), sortDescDefault: true,
            sortCB: ((data1, data2) => data1.cur.defBash - data2.cur.defBash)})
          row.addCell({title: t('table.bashSupS'), sortDescDefault: true,
            sortCB: ((data1, data2) => data1.cur.supBash - data2.cur.supBash)})
        })
  }, [t])
}
