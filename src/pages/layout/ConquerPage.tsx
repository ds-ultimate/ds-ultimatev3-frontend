import React, {ReactNode, useCallback, useState} from 'react';
import {Button, Card, Col, InputGroup, Row} from "react-bootstrap";
import {TFunction} from "i18next";
import DatatableHeaderBuilder from "../../util/datatables/DatatableHeaderBuilder";
import {useParams} from "react-router-dom";
import {useWorldData} from "../../apiInterface/loadContent";
import {useTranslation} from "react-i18next";
import DatatableBase, {SORTING_DIRECTION} from "../../util/datatables/DatatableBase";
import {nf} from "../../util/UtilFunctions";
import {
  conquerChangeType,
  conquerChangeTypeSetting,
  ConquerTime,
  conquerType,
  getConquerType,
  LinkConquerNew,
  LinkConquerOld,
  LinkConquerVillage
} from "../../modelHelper/Conquer";
import styles from "./ConquerPage.module.scss"
import BootstrapSelect from "../../util/bootstrapSelect";
import {allyTopSelect, playerTopSelect, villageSelect} from "../../apiInterface/apiConf";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import usePersistentState from "../../util/persitentState";
import {Dict} from "../../util/customTypes";
import {worldType} from "../../modelHelper/World";
import ErrorPage from "./ErrorPage";

type extLayoutParams = {
  typeName: ReactNode,
  who: ReactNode,
}

type intLayoutParams = extLayoutParams & {
  table: ReactNode,
  filters: ReactNode,
  highlighting: ReactNode,
}

type pageParams = extLayoutParams & {
  conquerSave: string,
  api: string
  highlightPossible: conquerChangeType[],
  conquerTypeFilterPossible: conquerChangeType[],
  filterPossible: string[],
}

export const FILTER_OPTIONS = {
  VILLAGE: "v",
  OLD_PLAYER: "op",
  OLD_ALLY: "oa",
  NEW_PLAYER: "np",
  NEW_ALLY: "na",
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

function ConquerPageLayout({typeName, who, table, filters, highlighting}: intLayoutParams) {
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
              {highlighting}
              {table}
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}

function toggleInArray<T>(arr: T[], dat: T) {
  let arr_cpy = arr.slice()
  const idx = arr_cpy.indexOf(dat)
  if (idx > -1) {
    arr_cpy.splice(idx, 1)
  } else {
    arr_cpy.push(dat)
  }
  return arr_cpy
}

function useConquerHighlightComponent(highlightPossible: conquerChangeType[], saveAt: string): [conquerChangeType[], ReactNode] {
  const { t } = useTranslation("ui")
  const [[, allowedHighlight], , ,setAllowedHighlight] = usePersistentState(saveAt, [null, highlightPossible])

  return [allowedHighlight, (
      <Row className={"mb-2"}>
        {highlightPossible.map(value => <Col key={value} xs={"auto"} className={"nowrap"}
                                             onClick={() => setAllowedHighlight((old) => toggleInArray(old, value))}>
          <>
            <div className={(allowedHighlight.includes(value)?conquerChangeTypeSetting[value].cls_act:conquerChangeTypeSetting[value].cls_in)}></div>
            {conquerChangeTypeSetting[value].title(t)}
          </>
        </Col>)}
      </Row>
  )]
}

function useConquerFilterComponent(filterPossible: string[], conquerTypePossible: conquerChangeType[], worldData: worldType | undefined): [Dict<string>, ReactNode] {
  const { t } = useTranslation("ui")
  const [activeFilters , setActiveFilters] = useState<Dict<string>>(() => {
    const result: Dict<string> = {}
    conquerTypePossible.forEach(value => result[value] = "1")
    return result
  })
  const filterOptions = [
    {k: "v", title: t("table.village"), api: villageSelect},
    {k: "op", title: t("table.old") + " " + t("table.owner"), api: playerTopSelect},
    {k: "oa", title: t("table.old") + " " + t("table.ally"), api: allyTopSelect},
    {k: "np", title: t("table.new") + " " + t("table.owner"), api: playerTopSelect},
    {k: "na", title: t("table.new") + " " + t("table.ally"), api: allyTopSelect},
  ]
  const toggleFilter = useCallback((old: Dict<string>, val: string) => {
    const clone: Dict<string> = {...old}

    if(clone[val] === "1") {
      clone[val] = "0"
    } else {
      clone[val] = "1"
    }

    return clone
  }, [])
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
        <Row className={"mb-2"}>
          {conquerTypePossible.map(value => <Col key={value} xs={"auto"} className={"nowrap"}>
            <InputGroup className={"flex-wrap-nowrap"}>
              <InputGroup.Checkbox
                  checked={activeFilters[value] === "1"}
                  id={`conquer-hig-${value}-check`}
                  onChange={() => setActiveFilters((old) => toggleFilter(old, value + ""))}
              />
              <InputGroup.Text as={"label"} htmlFor={`conquer-hig-${value}-check`}>{conquerChangeTypeSetting[value].title(t)}</InputGroup.Text>
            </InputGroup>
          </Col>)}
        </Row>
        <Row className={"mb-4"}>
          {filterOptions.map((value, index) => { return (
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

export default function ConquerPage({typeName, who, conquerSave, highlightPossible, filterPossible, conquerTypeFilterPossible, api}: pageParams) {
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const { t } = useTranslation("ui")
  const [showFilters, setShowFilters] = useState(false)
  const [allowedHighlight, highlighting] = useConquerHighlightComponent(highlightPossible, "conquer.hi_" + conquerSave)
  const [activeFilter, filterComponent] = useConquerFilterComponent(filterPossible, conquerTypeFilterPossible, worldData)

  if(worldErr) return <ErrorPage error={worldErr} />

  return <ConquerPageLayout
      typeName={typeName}
      who={who}
      highlighting={highlighting}
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
            rowClassGen={(c) => conquerChangeTypeSetting[getConquerType(c, allowedHighlight)].cls_act}
            saveAs={conquerSave}
            responsiveTable
            striped={false}
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
