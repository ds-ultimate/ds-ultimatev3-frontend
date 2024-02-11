import {useParams} from "react-router-dom"
import {useExtendedWorldData, useWorldData} from "../../apiInterface/loaders/world"
import {useTranslation} from "react-i18next"
import React, {ChangeEvent, useCallback, useEffect, useMemo, useState} from "react"
import {WorldDisplayName, worldDisplayNameRaw, worldUnitSingeType} from "../../modelHelper/World"
import ErrorPage from "../layout/ErrorPage"
import {Card, Col, FormControl, InputGroup, Row, Table, Tooltip} from "react-bootstrap"
import {FrontendError} from "../layout/ErrorPages/ErrorTypes"
import {getUnitIcon} from "../../util/dsHelpers/Icon"
import {CustomTooltip, SetStateType} from "../../util/UtilFunctions"
import {TroopArmyAmounts, UnitName} from "../../util/dsHelpers/TroopHelper"
import simulate, {SimulatorTroopResult} from "../../util/dsHelpers/Simulation"


export default function SimulatorPage() {
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const [worldExtErr, worldExt] = useExtendedWorldData(server, world)
  const [tUi]  = useTranslation("ui")
  const { t } = useTranslation("tool")

  const [attackerState, setAttackerState] = useState<TroopArmyAmounts>([])
  const [defenderState, setDefenderState] = useState<TroopArmyAmounts>([])
  const [wall, setWall] = useState<number>(0)
  const [luck, setLuck] = useState<number>(0)
  const [morale, setMorale] = useState<number>(1)

  useEffect(() => {
    if(worldData !== undefined) {
      document.title = worldDisplayNameRaw(tUi, worldData) + ": " + t("simulator.title")
    }
  }, [tUi, worldData, t])

  const worldConf = worldExt?.config
  const worldUnit = worldExt?.units
  const mappedUnits = useMemo(() => {
    if(worldUnit === undefined || worldUnit === null) return undefined
    return Object.keys(worldUnit).map(unitName => {
      const unitConf = worldUnit[unitName]
      if(unitConf === undefined) {
        return undefined
      }
      return {unitName, unitConf}
    }).filter(v => v !== undefined) as Array<{unitName: string, unitConf: worldUnitSingeType}>
  }, [worldUnit])

  if(worldErr) return <ErrorPage error={worldErr} />
  if(worldExtErr) return <ErrorPage error={worldExtErr} />
  if(worldConf === null || worldUnit === null) {
    const errData: FrontendError = {
      isFrontend: true,
      code: 404,
      k: "404.worldNotSupported",
      p: {},
    }
    return <ErrorPage error={errData} />
  }

  const simResult = (worldUnit !== undefined && worldConf !== undefined)?simulate({
    worldUnit, worldConfig: worldConf, morale, luck: (1+ luck/100), wall, isNight: false, farmLevel: 0,
    defender: defenderState, attacker: attackerState
  }):undefined

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-none d-lg-block"}>
            <h1 className={"fw-normal"}>
              {t("simulator.title") + " "}
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h1>
          </Col>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-lg-none"}>
            <h1 className={"fw-normal"}>
              {t("simulator.title") + " "}
            </h1>
            <h4>
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h4>
          </Col>
        </Col>
        <Col xs={12} xxl={8} className={"mt-2"}>
          <Card>
            <Card.Body>
              <Card.Title as={"h3"} className={"mb-3"}>{t("simulator.settings")}</Card.Title>
              <Table className={"text-center"}>
                <tbody>
                <tr>
                  <th></th>
                  {mappedUnits && mappedUnits.map(({unitName}) => <th key={unitName}>
                    <CustomTooltip overlay={<Tooltip><UnitName unit={unitName} /></Tooltip>}>
                      <img src={getUnitIcon(unitName)} alt={unitName} />
                    </CustomTooltip>
                  </th>)}
                </tr>
                <UnitArmyInput title={t("simulator.attacker")} mappedUnits={mappedUnits} state={attackerState} setState={setAttackerState} isAttacker/>
                <UnitArmyInput title={t("simulator.defender")} mappedUnits={mappedUnits} state={defenderState} setState={setDefenderState}/>
                </tbody>
              </Table>
              <InputGroup className={"mb-2"}>
                <InputGroup.Text>{t("simulator.wall")}</InputGroup.Text>
                <FormControl value={wall} onChange={event => setWall(+event.target.value)}/>
              </InputGroup>
              <InputGroup className={"mb-2"}>
                <InputGroup.Text>{t("simulator.luck")}</InputGroup.Text>
                <FormControl value={luck} onChange={event => setLuck(+event.target.value)}/>
              </InputGroup>
              <InputGroup className={"mb-2"}>
                <InputGroup.Text>{t("simulator.morale")}</InputGroup.Text>
                <FormControl value={morale} onChange={event => setMorale(+event.target.value)}/>
              </InputGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} xxl={8} className={"mt-2"}>
          <Card>
            <Card.Body>
              <Card.Title as={"h3"}>{t("simulator.result")}</Card.Title>
              <h5>{t("simulator.attacker")}</h5>
              {simResult && <TroopResultTable mappedUnits={mappedUnits} troops={simResult.attacker} isAttacker />}
              <h5>{t("simulator.defender")}</h5>
              {simResult && <TroopResultTable mappedUnits={mappedUnits} troops={simResult.defender} />}
              {simResult && simResult.wall.before} to {simResult && simResult.wall.after}
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}

function UnitArmyInput({title, mappedUnits, state, setState, isAttacker}: {
  title: string | null,
  mappedUnits: Array<{unitName: string, unitConf: worldUnitSingeType}> | undefined,
  state: TroopArmyAmounts,
  setState: SetStateType<TroopArmyAmounts>,
  isAttacker?: boolean,
}) {
  return (
      <tr>
        <td>{title}</td>
        {mappedUnits && mappedUnits.map(({unitName}) =>
            <td key={unitName}>
              {(!isAttacker || unitName !== "militia") &&<UnitInput name={unitName} state={state} setState={setState}/>}
            </td>)
        }
      </tr>
  )
}

function UnitInput({name, state, setState}: {
  name: string,
  state: TroopArmyAmounts,
  setState: SetStateType<TroopArmyAmounts>
}) {
  const valElm = state.find(([n,]) => n === name) ?? [name, 0]
  const val = valElm[1]

  const update = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setState(old => {
      return [...(old.filter(([n,]) => n !== name)), [name, +event.target.value]]
    })
  }, [setState, name])

  return <FormControl value={val} onChange={update} />
}

function TroopResultTable({mappedUnits, troops, isAttacker}: {
  mappedUnits: Array<{unitName: string, unitConf: worldUnitSingeType}> | undefined,
  troops: SimulatorTroopResult,
  isAttacker?: boolean,
}) {
  const { t } = useTranslation("tool")

  return (
      <Table>
        <tbody>
        <tr>
          <th></th>
          {mappedUnits && mappedUnits.map(({unitName}) => <th key={unitName}>
            <CustomTooltip overlay={<Tooltip><UnitName unit={unitName} /></Tooltip>}>
              <img src={getUnitIcon(unitName)} alt={unitName}/>
            </CustomTooltip>
          </th>)}
        </tr>
        {mappedUnits && <TroopDisplayRow mappedUnits={mappedUnits} troops={troops.before} title={t("simulator.before")} isAttacker={isAttacker} />}
        {mappedUnits && <TroopDisplayRow mappedUnits={mappedUnits} troops={troops.loss} title={t("simulator.loss")} isAttacker={isAttacker} />}
        {mappedUnits && <TroopDisplayRow mappedUnits={mappedUnits} troops={troops.survivors} title={t("simulator.survivors")} isAttacker={isAttacker} />}
        </tbody>
      </Table>
  )
}

function TroopDisplayRow({mappedUnits, troops, title, isAttacker}: {
  mappedUnits: Array<{unitName: string, unitConf: worldUnitSingeType}>,
  troops: TroopArmyAmounts,
  title: string | null,
  isAttacker?: boolean,
}) {
  return (
      <tr>
        <td>{title}</td>
        {mappedUnits.map(({unitName}) => {
          if(unitName === "militia" && isAttacker) {
            return <td key={unitName}></td>
          }
          const amount = troops.find(([n,]) => n === unitName)
          return <td key={unitName}>{amount !== undefined?amount[1]:0}</td>
        })}
      </tr>
  )
}
