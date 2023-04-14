import React, {ReactNode} from 'react';
import {Card, Col, Row} from "react-bootstrap";
import {TFunction} from "i18next";
import DatatableHeaderBuilder from "../../util/datatables/DatatableHeaderBuilder";
import {useParams} from "react-router-dom";
import {useWorldData} from "../../apiInterface/loadContent";
import {useTranslation} from "react-i18next";
import DatatableBase, {SORTING_DIRECTION} from "../../util/datatables/DatatableBase";
import {nf} from "../../util/UtilFunctions";
import {
  conquerChangeType, conquerChangeTypeSetting, ConquerTime,
  conquerType, getConquerType,
  LinkConquerNew,
  LinkConquerOld,
  LinkConquerVillage
} from "../../modelHelper/Conquer";
import styles from "./ConquerPage.module.scss"

type extLayoutParams = {
  typeName: ReactNode,
  who: ReactNode,
  highlightPossible: conquerChangeType[],
}

type intLayoutParams = extLayoutParams & {
  table: ReactNode,
}

type pageParams = extLayoutParams & {
  conquerSave: string,
  api: string
}

const ConquerDatatableHeader = (t: TFunction<"ui">) => {
  return new DatatableHeaderBuilder()
      .addMainRow(row => {
        row.addCell({sortBy: "village__name", title: t('table.villageName')})
        row.addCell({sortBy: "old_owner_name", title: (t('table.old') + " " + t('table.owner'))})
        row.addCell({sortBy: "new_owner_name", title: (t('table.new') + " " + t('table.owner'))})
        row.addCell({sortBy: "points", sortDescDefault: true, title: t('table.points')})
        row.addCell({sortBy: "timestamp", sortDescDefault: true, title: t('table.date')})
      })
}

function ConquerPageLayout({typeName, who, highlightPossible, table}: intLayoutParams) {
  const { t } = useTranslation("ui")
  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center d-none d-lg-block"}>
            <h1 className={"fw-normal"}>
              {typeName}: {who}
            </h1>
          </Col>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center d-lg-none truncate"}>
            <h1 className={"fw-normal"}>
              {typeName}
            </h1>
            <h4>
              {who}
            </h4>
          </Col>
        </Col>
        <Col xs={12} className={"mt-2"}>
          <Card>
            <Card.Body className={styles.smallMdd}>
              <Row className={"mb-2"}>
                {highlightPossible.map(value => <Col key={value} xs={"auto"} className={"nowrap"}>
                  <>
                    <div className={conquerChangeTypeSetting[value].className}></div>
                    {conquerChangeTypeSetting[value].title(t)}
                  </>
                </Col>)}
              </Row>
              {table}
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}
export default function ConquerPage({typeName, who, conquerSave, highlightPossible, api}: pageParams) {
  const {server, world} = useParams()
  const worldData = useWorldData(server, world)
  const { t } = useTranslation("ui")

  return <ConquerPageLayout
      typeName={typeName}
      who={who}
      highlightPossible={highlightPossible}
      table={
        <DatatableBase<conquerType>
            api={api}
            header={ConquerDatatableHeader(t)}
            cells={[
              (c) => <>{worldData && <LinkConquerVillage conquer={c} world={worldData}/>}</>,
              (c) => <>{worldData && <LinkConquerOld conquer={c} world={worldData}/>}</>,
              (c) => <>{worldData && <LinkConquerNew conquer={c} world={worldData} />}</>,
              (c) => nf.format(c.points),
              (c) => <ConquerTime conquer={c} />,
            ]}
            keyGen={c => c.id}
            serverSide
            defaultSort={["timestamp", SORTING_DIRECTION.DESC]}
            rowClassGen={(c) => conquerChangeTypeSetting[getConquerType(c)].className}
            saveAs={conquerSave}
            responsiveTable
            striped={false}
            //TODO change highlight
            //TODO filtering
        />
      }
  />
}