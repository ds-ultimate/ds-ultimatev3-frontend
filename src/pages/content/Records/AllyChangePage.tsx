import React, {ReactNode, useCallback, useMemo, useState} from 'react';
import {Button, Card, Col, InputGroup, Row} from "react-bootstrap";
import {TFunction} from "i18next";
import {useParams} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from "./AllyChangePage.module.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import {
  AllyChangeTime,
  allyChangeType,
  LinkAllyChangeNew,
  LinkAllyChangeOld,
  LinkAllyChangePlayer
} from "../../../modelHelper/AllyChange";
import DatatableHeaderBuilder from "../../../util/datatables/DatatableHeaderBuilder";
import BootstrapSelect from "../../../util/bootstrapSelect";
import {Dict} from "../../../util/customTypes";
import {allyTopSelect, playerTopSelect} from "../../../apiInterface/apiConf";
import {worldType} from "../../../modelHelper/World";
import ErrorPage from "../../layout/ErrorPage";
import {useWorldData} from "../../../apiInterface/loadContent";
import DatatableBase, {SORTING_DIRECTION} from "../../../util/datatables/DatatableBase";
import {thousandsFormat} from "../../../util/UtilFunctions";

type extLayoutParams = {
  typeName: ReactNode,
  who: ReactNode,
}

type intLayoutParams = extLayoutParams & {
  table: ReactNode,
  filters: ReactNode,
}

type pageParams = extLayoutParams & {
  allyChangeSave: string,
  api: string
  filterPossible: string[],
}

export const FILTER_OPTIONS = {
  PLAYER: "p",
  OLD_ALLY: "oa",
  NEW_ALLY: "na",
}

const AllyChangeDatatableHeader = (t: TFunction<"ui">) => {
  return new DatatableHeaderBuilder<allyChangeType>()
      .addMainRow(row => {
        row.addCell({sortBy: "created_at", sortDescDefault: true, title: t('table.date')})
        row.addCell({sortBy: "player__name", title: t('table.playerName')})
        row.addCell({sortBy: "new_ally__name", title: (t('table.new') + " " + t('table.ally'))})
        row.addCell({sortBy: "old_ally__name", title: (t('table.old') + " " + t('table.ally'))})
        row.addCell({sortBy: "points", sortDescDefault: true, title: t('table.points')})
      })
}

function AllyChangePageLayout({typeName, who, table, filters}: intLayoutParams) {
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
              {filters}
              {table}
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}

function useAllyChangeFilterComponent(filterPossible: string[], worldData: worldType | undefined): [Dict<string>, ReactNode] {
  const { t } = useTranslation("ui")
  const [activeFilters , setActiveFilters] = useState<Dict<string>>({})

  const filteredFilterOptions = useMemo(() => {
    const filterOptions = [
      {k: "p", title: t("table.playerName"), api: playerTopSelect},
      {k: "oa", title: t("table.old") + " " + t("table.ally"), api: allyTopSelect},
      {k: "na", title: t("table.new") + " " + t("table.ally"), api: allyTopSelect},
    ]

    return filterOptions.filter(value => filterPossible.includes(value.k))
  }, [t, filterPossible])

  const setFilter = useCallback((old: Dict<string>, key: string, val: string | null) => {
    const clone: Dict<string> = {...old}
    if(val !== null) {
      clone[key] = val
    } else {
      clone[key] = undefined
    }
    return clone
  }, [])

  return [activeFilters, (<>
        <Row className={"mb-4"}>
          {filteredFilterOptions.map((value, index) => { return (
              <Col key={value.k} xs={12} md={6} lg={4} className={"mb-2 col-xxl-flex-auto" + (index === 0?"":" ms-xxl-1")}>
                <InputGroup className={"flex-wrap-nowrap"}>
                  <InputGroup.Text>{value.title}</InputGroup.Text>
                  <BootstrapSelect
                      onChange={(newValue) => setActiveFilters(
                          (old) => setFilter(old, value.k, (newValue !== null)?(newValue.value + ""):null))}
                      api={worldData?value.api({world: (worldData.id + "")}):undefined}
                  />
                </InputGroup>
              </Col>
          )})}
        </Row>
      </>
  )]
}

export default function AllyChangePage({typeName, who, allyChangeSave, filterPossible, api}: pageParams) {
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const { t } = useTranslation("ui")
  const [showFilters, setShowFilters] = useState(false)
  const [activeFilter, filterComponent] = useAllyChangeFilterComponent(filterPossible, worldData)

  if(worldErr) return <ErrorPage error={worldErr} />

  return <AllyChangePageLayout
      typeName={typeName}
      who={who}
      table={
        <DatatableBase<allyChangeType>
            api={api}
            header={AllyChangeDatatableHeader(t)}
            cells={[
              (a) => <AllyChangeTime allyChange={a} />,
              (a) => <>{worldData && <LinkAllyChangePlayer allyChange={a} world={worldData}/>}</>,
              (a) => <>{worldData && <LinkAllyChangeNew allyChange={a} world={worldData}/>}</>,
              (a) => <>{worldData && <LinkAllyChangeOld allyChange={a} world={worldData} />}</>,
              (a) => thousandsFormat(a.points),
            ]}
            cellClasses={["", "", "", "", "text-end"]}
            keyGen={a => a.created_at + "_"  + a.player_id}
            serverSide
            defaultSort={["created_at", SORTING_DIRECTION.DESC]}
            saveAs={allyChangeSave}
            responsiveTable
            striped
            topBarEnd={<Col xs={12} md={"auto"} className={"mb-2"}>
              <Button variant={"success"} onClick={() => setShowFilters((old) => (!old))}>
                <FontAwesomeIcon icon={faFilter} />
              </Button>
            </Col>}
            api_params={{filter: activeFilter}}
            searching
        />
      }
      filters={showFilters && filterComponent}
  />
}
