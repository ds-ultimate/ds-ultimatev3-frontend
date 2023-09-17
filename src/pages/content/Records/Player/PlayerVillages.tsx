import {useTranslation} from "react-i18next";

import React, {useMemo} from "react";
import DatatableHeaderBuilder from "../../../../util/datatables/DatatableHeaderBuilder";
import {Card, Col, Row} from "react-bootstrap";
import DatatableBase, {DATATABLE_VARIANT, SORTING_DIRECTION} from "../../../../util/datatables/DatatableBase";
import {nf} from "../../../../util/UtilFunctions";
import {playerVillageTable} from "../../../../apiInterface/apiConf";
import {worldType} from "../../../../modelHelper/World";
import {
  LinkVillage,
  VillageBonusText,
  villageContinent,
  villageCoordinates, villagePureType,
} from "../../../../modelHelper/Village";

type paramType = {
  player_id: number,
  worldData: worldType,
}

export default function PlayerVillages({player_id, worldData}: paramType) {
  const {t} = useTranslation("ui")
  const villageHeader = usePlayerVillageHeader()

  return (
      <Row className={"justify-content-center"}>
        <Col xs={12} className={"mt-3"}>
          <Card>
            <Card.Body>
              <Card.Title as={"h4"}>{t("table-title.villages")}</Card.Title>
              <DatatableBase<villagePureType>
                  api={playerVillageTable({server: worldData.server__code, world: worldData.name, player: (player_id + "")})}
                  header={villageHeader}
                  cells={[
                    (v) => nf.format(v.villageID),
                    (v) => <>{worldData && <LinkVillage village={v} world={worldData} />}</>,
                    (v) => nf.format(v.points),
                    (v) => villageCoordinates(v),
                    (v) => villageContinent(v) + "",
                    (v) => <VillageBonusText vil={v} />,
                  ]}
                  cellClasses={["", "", "text-end", "text-end", "text-end", "text-end"]}
                  keyGen={v => v.villageID}
                  variant={DATATABLE_VARIANT.CLIENT_SIDE}
                  defaultSort={[0, SORTING_DIRECTION.ASC]}
                  saveAs={'playerVillage'}
                  responsiveTable
                  searching={filterVillageCallback}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}

export function filterVillageCallback(c: villagePureType, search: string) {
  return c.name.includes(search) ||
      villageCoordinates(c).includes(search) ||
      ("K" + villageContinent(c)).includes(search)
}

function usePlayerVillageHeader() {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder<villagePureType>()
        .addMainRow(row => {
          row.addCell({title: t('table.id'),
            sortCB: ((data1, data2) => data1.villageID - data2.villageID)})
          row.addCell({title: t('table.name'),
            sortCB: ((data1, data2) => data1.name.localeCompare(data2.name))})
          row.addCell({sortDescDefault: true, title: t('table.points'),
            sortCB: ((data1, data2) => data1.points - data2.points)})
          row.addCell({title: t('table.coordinates'),
            sortCB: ((data1, data2) => villageCoordinates(data1).localeCompare(villageCoordinates(data2)))})
          row.addCell({title: t('table.continent'),
            sortCB: ((data1, data2) => villageContinent(data1) - villageContinent(data2))})
          row.addCell({sortDescDefault: true, title: t('table.bonusType'),
            sortCB: ((data1, data2) => data1.bonus_id - data2.bonus_id)})
        })
  }, [t])
}
