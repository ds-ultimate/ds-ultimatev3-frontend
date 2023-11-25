import {useParams} from "react-router-dom"
import {useWorldData} from "../../apiInterface/loaders/world"
import {useTranslation} from "react-i18next"
import React, {useEffect, useState} from "react"
import {WorldDisplayName, worldDisplayNameRaw} from "../../modelHelper/World"
import ErrorPage from "../layout/ErrorPage"
import {Card, Col, Form, Row} from "react-bootstrap"
import BootstrapSelect from "../../util/bootstrapSelect"
import {allySelect, playerSelect} from "../../apiInterface/apiConf"
import {TableGeneratorOutput} from "./TableGenerator/TableGeneratorOutput"


export type columnOptionType = {
  lineNumbers: boolean,
  points: boolean,
  casualPointRange: boolean,
}

const columnOptionDefault: columnOptionType = {
  lineNumbers: false,
  points: false,
  casualPointRange: false,
}

export default function TableGeneratorPage() {
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const [tUi]  = useTranslation("ui")
  const { t } = useTranslation("tool")
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined)
  const [sorting, setSorting] = useState<string>("points")
  const [columns, setColumns] = useState<columnOptionType>(columnOptionDefault)
  const [emptyColumnCnt, setEmptyColumnCnt] = useState<number>(0)
  const [selectedBaseEntry, setSelectedBaseEntry] = useState<number | undefined>(undefined)

  useEffect(() => {
    if(worldData !== undefined) {
      document.title = worldDisplayNameRaw(tUi, worldData) + ": " + t("tableGenerator.title")
    }
  }, [tUi, worldData, t])

  if(worldErr) return <ErrorPage error={worldErr} />

  const typeApi = selectedType === "villageByPlayer"?playerSelect:allySelect
  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-none d-lg-block"}>
            <h1 className={"fw-normal"}>
              {t("tableGenerator.title") + " "}
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h1>
          </Col>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-lg-none"}>
            <h1 className={"fw-normal"}>
              {t("tableGenerator.title") + " "}
            </h1>
            <h4>
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h4>
          </Col>
        </Col>
        <Col xs={12} md={6} className={"mt-2"}>
          <Card>
            <Card.Body>
              <Card.Title>{t("tableGenerator.settings")}</Card.Title>
              <FormGroup title={t("tableGenerator.type")}>
                <StateBasedOption value={"playerByAlly"} label={t("tableGenerator.playerByAlly")} state={selectedType} setState={setSelectedType} />
                <StateBasedOption value={"villageByPlayer"} label={t("tableGenerator.villageByPlayer")} state={selectedType} setState={setSelectedType} />
                <StateBasedOption value={"villageByAlly"} label={t("tableGenerator.villageByAlly")} state={selectedType} setState={setSelectedType} />
                <StateBasedOption value={"villageAndPlayerByAlly"} label={t("tableGenerator.villageAndPlayerByAlly")} state={selectedType} setState={setSelectedType} />
              </FormGroup>
              <hr />
              <FormGroup title={t("tableGenerator.sorting")}>
                <Form.Select onChange={event => setSorting(event.target.value)} value={sorting}>
                  <option value={"points"}>{t("tableGenerator.sortingPoints")}</option>
                  <option value={"name"}>{t("tableGenerator.sortingName")}</option>
                </Form.Select>
              </FormGroup>
              <hr />
              <FormGroup title={t("tableGenerator.columns")}>
                <StateBasedCheck value={"lineNumbers"} label={t("tableGenerator.numberLines")} state={columns} setState={setColumns} />
                <Form.Group controlId={"names"}>
                  <Form.Check
                      type={"checkbox"}
                      checked={true}
                      label={t("tableGenerator.names")}
                      disabled
                      readOnly
                  />
                </Form.Group>
                <StateBasedCheck value={"points"} label={t("tableGenerator.points")} state={columns} setState={setColumns} />
                <StateBasedCheck value={"casualPointRange"} label={t("tableGenerator.casualPointRange")}
                                 state={columns} setState={setColumns} disabled={selectedType !== "playerByAlly"}/>
              </FormGroup>
              <hr />
              <FormGroup title={t("tableGenerator.additionalColumns")}>
                <Form.Select onChange={event => setEmptyColumnCnt(+event.target.value)} value={emptyColumnCnt}>
                  {[0, 1, 2, 3, 4, 5].map(value => <option value={value} key={value}>{value}</option>)}
                </Form.Select>
              </FormGroup>
              <hr />
              <FormGroup title={selectedType === "villageByPlayer"?t("tableGenerator.player"):t("tableGenerator.ally")}>
                <BootstrapSelect
                    onChange={(newValue) => setSelectedBaseEntry(newValue?.value)}
                    api={worldData?typeApi({world: (worldData.id + "")}):undefined}
                />
              </FormGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={6} className={"mt-2"}>
          {worldData && <TableGeneratorOutput
              worldData={worldData}
              selectedType={selectedType}
              sorting={sorting}
              columns={columns}
              emptyColumnCnt={emptyColumnCnt}
              selectedBaseEntry={selectedBaseEntry}
          />}
        </Col>
      </Row>
  )
}


function FormGroup({title, children}: {title: string, children: React.ReactElement | React.ReactElement[]}) {
  return (
      <Row>
        <Col xs={4}>
          <b>{title}</b>
        </Col>
        <Col xs={8}>
          {children}
        </Col>
      </Row>
  )
}

type booleanValues = {
  [key: string]: boolean,
}

function StateBasedCheck<O extends booleanValues, K extends string & keyof O>(
    {value, label, state, setState, disabled}: {value: K, label: string, state: O, setState: (cb: (old: O) => O) => void, disabled?: boolean}) {
  return (
      <Form.Group controlId={value}>
        <Form.Check
            type={"checkbox"}
            checked={state[value]}
            onChange={event => setState(old => ({...old, [value]: event.target.checked}))}
            label={label}
            disabled={disabled}
        />
      </Form.Group>
  )
}

function StateBasedOption({value, label, state, setState}: {value: string, label: string, state: string | undefined, setState: (n: string | undefined) => void}) {
  return (
      <Form.Group controlId={value}>
        <Form.Check
            type={"radio"}
            checked={state === value}
            onChange={event => setState(event.target.checked?value:undefined)}
            label={label}
        />
      </Form.Group>
  )
}
