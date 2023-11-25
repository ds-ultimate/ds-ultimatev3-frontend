import {useTranslation} from "react-i18next";

import {allyType} from "../../../../modelHelper/Ally";
import {worldType} from "../../../../modelHelper/World";
import {dateFormatLocal_DMY, dateFormatYMD, DecodeName, ShowHistory} from "../../../../util/UtilFunctions";
import React, {useMemo} from "react";
import DatatableHeaderBuilder from "../../../../util/datatables/DatatableHeaderBuilder";
import DatatableBase, {DATATABLE_VARIANT, SORTING_DIRECTION} from "../../../../util/datatables/DatatableBase";
import {allyAllyHistoryTable} from "../../../../apiInterface/apiConf";
import {Card, Col, Row} from "react-bootstrap";
import {LinkAllyInGame} from "../Util";

type paramType = {
  ally_id: number,
  worldData: worldType,
}

type allyHistoryType = {
  cur: allyType,
  last: allyType | null,
  date: string,
}

export default function AllyHistPane({ally_id, worldData}: paramType) {
  const {t} = useTranslation("ui")
  const histHeader = useAllyHistoryHeader()

  return (
      <Row>
        <Col xs={12} md={6}>
          <Card.Title as={"h4"}>{t("table-title.allyHist")}</Card.Title>
        </Col>
        <Col xs={12} md={6}>
          <span className={"float-end"}>
            {worldData && <LinkAllyInGame worldData={worldData} ally_id={ally_id}>{t("inGame.normal")}</LinkAllyInGame>}
            {worldData && <LinkAllyInGame worldData={worldData} ally_id={ally_id} guestMode>{t("inGame.guest")}</LinkAllyInGame>}
          </span>
        </Col>
        <Col xs={12}>
          <DatatableBase<allyHistoryType>
              header={histHeader}
              saveAs={"allyHistory"}
              api={allyAllyHistoryTable({server: worldData.server__code, world: worldData.name, ally: (ally_id + "")})}
              cells={[
                (a) => dateFormatLocal_DMY(new Date(a.date)),
                (a) => <DecodeName name={a.cur.tag} />,
                (a) => <ShowHistory name={t('table.rank')} o_dat={a.last?.rank} n_dat={a.cur.rank} invert />,
                (a) => <ShowHistory name={t('table.members')} o_dat={a.last?.member_count} n_dat={a.cur.member_count} />,
                (a) => <ShowHistory name={t('table.points')} o_dat={a.last?.points} n_dat={a.cur.points} tsd_format />,
                (a) => <ShowHistory name={t('table.villages')} o_dat={a.last?.village_count} n_dat={a.cur.village_count} />,
                (a) => <ShowHistory name={t('table.bashAllS')} o_dat={a.last?.gesBash} n_dat={a.cur.gesBash} tsd_format />,
                (a) => <ShowHistory name={t('table.bashAttS')} o_dat={a.last?.offBash} n_dat={a.cur.offBash} tsd_format />,
                (a) => <ShowHistory name={t('table.bashDefS')} o_dat={a.last?.defBash} n_dat={a.cur.defBash} tsd_format />,
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

function useAllyHistoryHeader() {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder<allyHistoryType>()
        .addMainRow(row => {
          row.addCell({title: t('table.date'), sortDescDefault: true,
            sortCB: (data1, data2) => {
              const d1 = new Date(data1.date)
              const d2 = new Date(data2.date)
              return d1.getTime() - d2.getTime()
            }})
          row.addCell({showAt: "lg", title: t('table.ally')})
          row.addCell({title: t('table.rank'),
            sortCB: ((data1, data2) => data1.cur.rank - data2.cur.rank)})
          row.addCell({title: t('table.members'), sortDescDefault: true,
            sortCB: ((data1, data2) => data1.cur.member_count - data2.cur.member_count)})
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
        })
  }, [t])
}
