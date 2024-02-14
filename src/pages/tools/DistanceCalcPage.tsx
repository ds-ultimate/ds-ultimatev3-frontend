import {useParams} from "react-router-dom";
import React, {FormEvent, ClipboardEvent, useCallback, useEffect, useState} from "react";
import {useExtendedWorldData, useWorldData} from "../../apiInterface/loaders/world"
import {useTranslation} from "react-i18next";
import ErrorPage from "../layout/ErrorPage";
import {WorldDisplayName, worldDisplayNameRaw, worldUnitType} from "../../modelHelper/World"
import {Card, Col, FormControl, InputGroup, Row, Table} from "react-bootstrap"
import {useVillageDataAllyXY} from "../../apiInterface/loaders/village"
import {nf, rawDecodeName, truncate} from "../../util/UtilFunctions"
import {villageContinent} from "../../modelHelper/Village"
import LoadingScreen from "../layout/LoadingScreen"
import {getUnitIcon} from "../../util/dsHelpers/Icon"
import {FrontendError} from "../layout/ErrorPages/ErrorTypes"
import {worldConfigType} from "../../modelHelper/WorldConfig"


export default function DistanceCalcPage() {
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const [worldExtendedErr, worldDataExtended] = useExtendedWorldData(server, world)
  const [tUi]  = useTranslation("ui")
  const { t } = useTranslation("tool")

  useEffect(() => {
    if(worldData !== undefined) {
      document.title = worldDisplayNameRaw(tUi, worldData) + ": " + t("distCalc.title")
    }
  }, [tUi, worldData, t])

  if(worldErr) return <ErrorPage error={worldErr} />
  if(worldExtendedErr) return <ErrorPage error={worldExtendedErr} />

  let worldConf = worldDataExtended?.config
  let worldUnit = worldDataExtended?.units
  if(worldConf === null || worldUnit === null) {
    const errData: FrontendError = {
      isFrontend: true,
      code: 404,
      k: "404.worldNotSupported",
      p: {},
    }
    return <ErrorPage error={errData} />
  }

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-none d-lg-block"}>
            <h1 className={"fw-normal"}>
              {t("distCalc.title") + " "}
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h1>
          </Col>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-lg-none"}>
            <h1 className={"fw-normal"}>
              {t("distCalc.title") + " "}
            </h1>
            <h4>
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h4>
          </Col>
        </Col>
        <Calculator worldConf={worldConf} worldUnit={worldUnit} />
      </Row>
  )
}

function Calculator({worldConf, worldUnit}: {worldConf?: worldConfigType, worldUnit?: worldUnitType}) {
  const [startPos, setStartPos] = useState<[number, number] | undefined>(undefined)
  const [targetPos, setTargetPos] = useState<[number, number] | undefined>(undefined)

  return (
      <>
        <Col xs={12} lg={6} className={"mt-2"}>
          <Card>
            <LoadingScreen darken>
              <VillageInputs setStartPos={setStartPos} setTargetPos={setTargetPos} />
            </LoadingScreen>
          </Card>
        </Col>
        <Col xs={12} lg={6} className={"mt-2"}>
          <Card>
            <ResultCard startPos={startPos} targetPos={targetPos} worldConf={worldConf} worldUnit={worldUnit} />
          </Card>
        </Col>
      </>
  )
}

type VillageUpdateCB = (pos: [number, number] | undefined) => void

function VillageInputs({setStartPos, setTargetPos}: {setStartPos: VillageUpdateCB, setTargetPos: VillageUpdateCB}) {
  const { t } = useTranslation("tool")

  const [InputElementStart, ShowElementStart] = useVillageInput(t("distCalc.startVillage"), setStartPos)
  const [InputElementTarget, ShowElementTarget] = useVillageInput(t("distCalc.targetVillage"), setTargetPos)
  return (
      <Card.Body>
        <Card.Title as={"h4"}>{t("distCalc.titleGeneral")}</Card.Title>
        {InputElementStart}
        {InputElementTarget}
        {ShowElementStart}
        {ShowElementTarget}
      </Card.Body>
  )
}

function useVillageInput(text: string | null, onChange: VillageUpdateCB) {
  const {server, world} = useParams()
  const [xCoordinates, setXCoordinates] = useState<string>("")
  const [yCoordinates, setYCoordinates] = useState<string>("")
  const [tmpValidCoords, setTmpValidCoords] = useState<[string | undefined, string | undefined]>([undefined, undefined])
  const [yInputRef, setYInputRef] = useState<HTMLInputElement | null>(null)
  const { t } = useTranslation("tool")

  const [villageErr, villageData] = useVillageDataAllyXY(server, world, tmpValidCoords[0], tmpValidCoords[1])

  useEffect(() => {
    const x = +xCoordinates
    const y = +yCoordinates
    if(! isNaN(x) && ! isNaN(y) && x > 0 && y > 0) {
      setTmpValidCoords([xCoordinates, yCoordinates])
      onChange([x, y])
    } else {
      setTmpValidCoords([undefined, undefined])
      onChange(undefined)
    }
  }, [onChange, xCoordinates, yCoordinates]);

  const onInputX = useCallback((event: FormEvent<HTMLInputElement>) => {
    if(event.currentTarget.value.length === event.currentTarget.maxLength) {
      if(yInputRef) {
        yInputRef.focus()
      }
    }
  }, [yInputRef])

  const onPaste = useCallback((event: ClipboardEvent<HTMLInputElement>) => {
    const pastedData = event.clipboardData.getData('text')
    const match = pastedData.match(/(\d{1,3})\|(\d{1,3})/)
    if(match !== null) {
      event.preventDefault()
      setXCoordinates(match[1])
      setYCoordinates(match[2])
    }
  }, [setXCoordinates, setYCoordinates])

  const isValid = villageData !== undefined
  const isInvalid = villageErr !== undefined && villageErr !== null

  const InputElement = (
      <InputGroup className={"mb-3"}>
        <InputGroup.Text>{text}</InputGroup.Text>
        <FormControl inputMode={"numeric"} placeholder={"500"} maxLength={3} value={xCoordinates} isValid={isValid} isInvalid={isInvalid}
                     onChange={event => setXCoordinates(event.target.value)} onInput={onInputX} onPaste={onPaste} />
        <InputGroup.Text>|</InputGroup.Text>
        <FormControl inputMode={"numeric"} placeholder={"500"} maxLength={3} value={yCoordinates} isValid={isValid} isInvalid={isInvalid}
                     onChange={event => setYCoordinates(event.target.value)} ref={setYInputRef} onPaste={onPaste} />
      </InputGroup>
  )

  const ShowElement = (
      <Table striped bordered className={"nowrap"}>
        <tbody>
        <tr><th style={{width: "150px"}}>{text}</th><td>{
          tmpValidCoords[0] && tmpValidCoords[1] && (villageData === undefined?
                t("distCalc.villageNotExist") + " " + tmpValidCoords[0] + " | " + tmpValidCoords[1]:
            <>
              {truncate(rawDecodeName(villageData.name), 25)} <b>{villageData.x}|{villageData.y}</b> [K{villageContinent(villageData)}]
            </>)
        }</td></tr>
        <tr>
          <th>{t("distCalc.points")}</th>
          <td>{villageData && nf.format(villageData.points)}</td>
        </tr>
        <tr>
          <th>{t("distCalc.owner")}</th>
          <td>{villageData?.playerLatest__name && rawDecodeName(villageData.playerLatest__name)}</td>
        </tr>
        <tr>
          <th>{t("distCalc.ally")}</th>
          <td>{villageData?.playerLatest__allyLatest__name && rawDecodeName(villageData.playerLatest__allyLatest__name)}</td>
        </tr>
        </tbody>
      </Table>
  )

  return [InputElement, ShowElement]
}

type ResultParams = {
  worldConf?: worldConfigType,
  worldUnit?: worldUnitType
  startPos: [number, number] | undefined,
  targetPos: [number, number] | undefined,
}
function ResultCard({worldConf, worldUnit, startPos, targetPos}: ResultParams) {
  const [ tUi ] = useTranslation("ui")
  const { t } = useTranslation("tool")

  const isArcher = worldConf === undefined || worldConf.game.archer > 0
  const isKnight = worldConf === undefined || worldConf.game.knight > 0
  let units = ["spear", "sword", "axe", isArcher?"archer":undefined, "spy", "light",
    isArcher?"marcher":undefined, "heavy", "ram", "catapult", isKnight?"knight":undefined, "snob"]

  return (
      <Card.Body>
        <Card.Title as={"h4"}>{t("distCalc.units")}</Card.Title>
        <Table striped bordered className={"nowrap"}>
          <tbody>
          <tr>
            <th style={{width: "200px"}}>{t("distCalc.unit")}</th>
            <th>{t("distCalc.time")}</th>
          </tr>
          {units.map(unit => {
            if(unit === undefined) {
              return undefined
            }
            let tdInner: React.ReactElement | string = "--:--:--"
            if(worldUnit) {
              const unitConf = worldUnit[unit]
              if(unitConf) {
                let runTime = Math.round(unitConf.speed * 60)
                if(startPos && targetPos) {
                  runTime = getRunTime(unitConf.speed * 60, startPos, targetPos)
                }
                tdInner = <ShowTimeDiff diff={runTime} />
              }
            }
            return (<tr key={unit}>
              <td><img src={getUnitIcon(unit)} alt={unit} /> {tUi("unit." + unit)}</td>
              <td>{tdInner}</td>
            </tr>)
          })}
          </tbody>
        </Table>
      </Card.Body>
  )
}

function getRunTime(speed: number, startPos: [number, number], targetPos: [number, number]) {
  const xDiff = startPos[0] - targetPos[0]
  const yDiff = startPos[1] - targetPos[1]
  const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff)
  const runTime = distance * speed
  return Math.round(runTime)
}

function ShowTimeDiff({diff}: {diff: number}) {
  const { t } = useTranslation("tool")

  const seconds = diff % 60
  const allMinutes = Math.floor(diff / 60)
  const minutes = allMinutes % 60
  const allHours = Math.floor(allMinutes / 60)
  const hours = allHours % 60
  const days = Math.floor(allHours / 60)

  return (
      <>{days} {t("distCalc.days")} {pad(hours)}:{pad(minutes)}:{pad(seconds)}</>
  )
}

function pad(i: number) {
  return (i < 10) ? '0'+i : i
}
