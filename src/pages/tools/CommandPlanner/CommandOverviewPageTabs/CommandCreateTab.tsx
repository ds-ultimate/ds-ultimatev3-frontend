import {Button, Card, Col, Dropdown, DropdownButton, Form, FormControl, InputGroup, Row} from "react-bootstrap"
import {
  calculateArrivalTime,
  calculateSendTime,
  CommandList,
  commandPlannerUnitName, NewCommandListItem,
  useCommandPlannerTypeIconsGrouped,
  useTypeIDToName
} from "../../../../modelHelper/Tool/CommandList"
import React, {FormEvent, ReactNode, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faEdit, faSave} from "@fortawesome/free-solid-svg-icons"
import {useTranslation} from "react-i18next"
import {StateUpdater} from "../../../../util/customTypes"
import {get_icon, getUnitIcon} from "../../../../util/dsHelpers/Icon"
import {dateFormatHMS, dateFormatYMD, range} from "../../../../util/UtilFunctions"
import {knightType, worldConfigType} from "../../../../modelHelper/WorldConfig"
import {getAmountForUnit, setAmountForUnit, TroopArmyAmounts} from "../../../../util/dsHelpers/TroopHelper"
import {boostrapConfirm} from "../../../../util/boostrapConfirm"

import tribeSkill from "../images/tribe_skill.png"
import supportBuf from "../images/support_boost.png"
import {worldType, worldUnitType} from "../../../../modelHelper/World"
import {
  useCreateCommandListItem,
  useEmptyCommandList, useRemoveOutdated, useRemoveSent,
  useUpdateTitle
} from "../../../../modelHelper/Tool/CommandListAPIHelper"
import {getVillageInfoXY} from "../../../../apiInterface/worldDataAPI"
import {useCreateToast} from "../../../layout/ToastHandler"


enum TimeType {
  ARRIVAL,
  SEND,
}

enum ValidState {
  UNKNOWN,
  VALID,
  INVALID,
}


export default function CommandCreateTab({list, updateList, worldData, worldConf, worldUnitConf}:{
  list: CommandList, updateList: StateUpdater<CommandList>, worldData: worldType,
  worldConf: worldConfigType, worldUnitConf: worldUnitType
}) {
  const { t } = useTranslation("tool")

  const [commandType, setCommandType] = useState<number>(8)
  const [startVillage, setStartVillage] = useState<number>(-1)
  const [targetVillage, setTargetVillage] = useState<number>(-1)
  const [timestamp, setTimestamp] = useState<number>(-1)
  const [timeType, setTimeType] = useState<TimeType>(TimeType.ARRIVAL)
  const [unit, setUnit] = useState<number>(0)
  const [troops, setTroops] = useState<TroopArmyAmounts>([])
  const [tribeBoost, setTribeBoost] = useState<number>(0)
  const [supportBoost, setSupportBoost] = useState<number>(0)

  const newCommand: CommandWithoutTime = {
    type: commandType, startVillageId: startVillage, targetVillageId: targetVillage,
    unit, sent: false, troops, tribeBoost, supportBoost
  }

  const isArcher = worldConf.game.archer > 0
  const isKnight = worldConf.game.knight !== knightType.DISABLED
  const availableUnits = range(0, commandPlannerUnitName.length).map((_, idx) => idx)
      .filter((_, idx) => ((idx !== 3 && idx !== 6) || isArcher) && (idx !== 10 || isKnight))

  return (
      <Row>
        <EditableTitleElement list={list} updateList={updateList} />
        <TypeInput cur={commandType} result={setCommandType} />
        <VillageInput result={setStartVillage} title={t("commandPlanner.overview.prop.startVillage")} worldData={worldData} />
        <VillageInput result={setTargetVillage} title={t("commandPlanner.overview.prop.targetVillage")} worldData={worldData} />
        <DateInput result={setTimestamp} type={timeType} setType={setTimeType} isMillis={worldConf.commands.millis_arrival !== 0} />
        <UnitInput cur={unit} result={setUnit} availableUnits={availableUnits} />
        <TroopAmountInput cur={troops} result={setTroops} availableUnits={availableUnits} slowest={unit} worldUnitConf={worldUnitConf} />
        <BoostInput cur={tribeBoost} result={setTribeBoost} title={t("commandPlanner.overview.prop.tribe_boost")}
                    image={tribeSkill} values={range(0, 0.20, 0.01, true)}/>
        <BoostInput cur={supportBoost} result={setSupportBoost} title={t("commandPlanner.overview.prop.support_boost")}
                    image={supportBuf} values={range(0, 0.3, 0.1, true)}/>
        <ButtonsMassDelete world={worldData} worldUnit={worldUnitConf} list={list} updateList={updateList} newCommand={newCommand} time={timestamp} timeType={timeType} />
      </Row>
  )
}

function EditableTitleElement({list, updateList}: {list: CommandList, updateList: StateUpdater<CommandList>}) {
  const [curTitle, setCurTitle] = useState<string>(list.title ?? "")
  const [editActive, setEditActive] = useState<boolean>(false)
  const { t } = useTranslation("tool")
  const updateTitle = useUpdateTitle()

  const editTitle = useCallback(() => {
    setEditActive(true)
    setCurTitle(list.title ?? "")
  }, [setEditActive, setCurTitle, list])

  const saveTitle = useCallback((e: FormEvent<HTMLFormElement>) => {
    setEditActive(false)
    e.preventDefault()
    updateTitle(list, updateList, curTitle)
  }, [setEditActive, curTitle, list, updateList, updateTitle])

  return (
      <Col xs={12} className={"text-center mb-3"}>
        {!editActive?<>
          <Card.Title as={"h3"}>
            {list.title !== null?list.title:t("commandPlanner.overview.noTitle")}
            <Button className={"ms-3"} size={"sm"} onClick={editTitle}><FontAwesomeIcon icon={faEdit} /></Button>
          </Card.Title>
        </>:<Form onSubmit={saveTitle}>
          <InputGroup>
            <Form.Control value={curTitle} onChange={e => setCurTitle(e.target.value)}/>
            <Button type={"submit"}><FontAwesomeIcon icon={faSave} /></Button>
          </InputGroup>
        </Form>}
        <hr />
      </Col>
  )
}

function TypeInput({cur, result}: {cur: number, result: StateUpdater<number>}) {
  const { t } = useTranslation("tool")
  const iconsGrouped = useCommandPlannerTypeIconsGrouped()
  const typeToName = useTypeIDToName()

  return (
      <CommandInputWrapper>
        <InputGroup.Text>{t("commandPlanner.overview.prop.type")}</InputGroup.Text>
        <InputGroup.Text><img src={get_icon(cur)} alt={""}/></InputGroup.Text>
        <Form.Select className={"bootstrap-select-custom"} value={cur} onChange={e => result(+e.target.value)}>
          {iconsGrouped.map(({title, items}, idx) => (
              <optgroup label={title} key={idx}>
                {items.map(item => <option key={item} value={item}>{typeToName(item)}</option>)}
              </optgroup>
          ))}
        </Form.Select>

      </CommandInputWrapper>
  )
}

function VillageInput({result, title, worldData}: {result: StateUpdater<number>, title: string | null, worldData: worldType}) {
  const [coord, setCoord] = useState<{x: string, y: string}>({x: "", y: ""})
  const yInputRef = useRef<HTMLInputElement>(null)
  const [valid, setValid] = useState<ValidState>(ValidState.UNKNOWN)

  const updateCoord = useCallback((xVal: string | null, yVal: string | null) => {
    let xStr = xVal ?? coord.x
    let yStr = yVal ?? coord.y
    let xOrY = xVal ?? yVal

    if(xOrY !== null)  {
      const match = xOrY.match(/(\d{1,3})\|(\d{1,3})/)
      if(match !== null) {
        xStr = match[1]
        yStr = match[2]
      }
    }
    setCoord({x: xStr, y: yStr})

    if(xVal !== null && xVal.length >= 3) {
      yInputRef.current?.focus()
    }

    const x = +xStr, y= +yStr
    if(isNaN(x) || isNaN(y)) {
      setValid(ValidState.UNKNOWN)
      result(-1)
    } else {
      getVillageInfoXY(worldData, x, y)
      .then(value => {
        if(value === undefined) {
          setValid(ValidState.INVALID)
          result(-1)
        } else {
          setValid(ValidState.VALID)
          result(value.villageID)
        }
      })
    }
  }, [coord, setCoord, setValid, result, worldData])

  return (
      <CommandInputWrapper>
        <InputGroup.Text>{title}</InputGroup.Text>
        <Form.Control
            onChange={e => updateCoord(e.target.value, null)}
            value={coord.x} className={validCls(valid)} placeholder={"123"} />
        <InputGroup.Text>|</InputGroup.Text>
        <Form.Control
            ref={yInputRef} onChange={e => updateCoord(null, e.target.value)}
            value={coord.y}  className={validCls(valid)} placeholder={"123"} />
      </CommandInputWrapper>
  )
}

function DateInput({result, type, setType, isMillis}: {result: StateUpdater<number>, type: TimeType, setType: StateUpdater<TimeType>, isMillis: boolean}) {
  const { t } = useTranslation("tool")
  const [date, setDate] = useState<string>(dateFormatYMD(new Date()))
  const [dateValid, setDateValid] = useState<ValidState>(ValidState.UNKNOWN)
  const [time, setTime] = useState<string>(dateFormatHMS(new Date()))
  const [timeValid, setTimeValid] = useState<ValidState>(ValidState.UNKNOWN)

  useEffect(() => {
    const dateTimeStamp = Date.parse(date)
    if(date.length <= 0) {
      setDateValid(ValidState.UNKNOWN)
    } else if(isNaN(dateTimeStamp)) {
      setDateValid(ValidState.INVALID)
    } else {
      setDateValid(ValidState.VALID)
    }

    const resultDate = Date.parse(date + " " + time)
    if(time.length <= 0) {
      result(-1)
      setTimeValid(ValidState.UNKNOWN)
    } else if(isNaN(resultDate)) {
      result(-1)
      setTimeValid(ValidState.INVALID)
    } else {
      result(resultDate)
      setTimeValid(ValidState.VALID)
    }
  }, [date, time, result])

  return (
      <>
        <CommandInputWrapper>
          <InputGroup.Text>{t("commandPlanner.overview.prop.date")}</InputGroup.Text>
          <FormControl type={"date"} onChange={e => setDate(e.target.value)} value={date} className={validCls(dateValid)} />
        </CommandInputWrapper>
        <CommandInputWrapper>
          <DropdownButton
              title={type===TimeType.ARRIVAL?
                  t("commandPlanner.overview.prop.arrivalTime"):t("commandPlanner.overview.prop.sendTime")}>
            <Dropdown.Item onClick={() => setType(TimeType.ARRIVAL)}>{t("commandPlanner.overview.prop.arrivalTime")}</Dropdown.Item>
            <Dropdown.Item onClick={() => setType(TimeType.SEND)}>{t("commandPlanner.overview.prop.sendTime")}</Dropdown.Item>
          </DropdownButton>
          <FormControl type={"time"} step={isMillis?"0.001":undefined} onChange={e => setTime(e.target.value)} value={time} className={validCls(timeValid)} />
        </CommandInputWrapper>
      </>
  )
}

function UnitInput({cur, result, availableUnits}: {cur: number, result: StateUpdater<number>, availableUnits: number[]}) {
  const [ tUi ] = useTranslation("ui")
  const { t } = useTranslation("tool")

  const unitName = commandPlannerUnitName[cur]

  return (
      <CommandInputWrapper>
        <InputGroup.Text>{t("commandPlanner.overview.prop.unit")}</InputGroup.Text>
        <InputGroup.Text><img src={getUnitIcon(unitName)} alt={unitName}/></InputGroup.Text>
        <Form.Select className={"bootstrap-select-custom"} onChange={e => result(+e.target.value)} value={cur}>
          {availableUnits.map(val => (
                  <option key={val} value={val}>{tUi("unit." + commandPlannerUnitName[val])}</option>
              ))
          }
        </Form.Select>
      </CommandInputWrapper>
  )
}

function TroopAmountInput({cur, result, availableUnits, slowest, worldUnitConf}: {
  cur: TroopArmyAmounts, result: StateUpdater<TroopArmyAmounts>, availableUnits: number[], slowest: number, worldUnitConf: worldUnitType
}) {
  const mappedUnits = useMemo(() => availableUnits.map(val => commandPlannerUnitName[val]), [availableUnits])
  const minSpeed = worldUnitConf[commandPlannerUnitName[slowest]]?.speed

  return (
      <Col xs={12}>
        <Row>
          {mappedUnits.map(name => {
            const uConf = worldUnitConf[name]
            if(uConf === undefined) return undefined
            const disabled = minSpeed !== undefined && uConf.speed > minSpeed

            return (
                <Col key={name} xs={12} md={6} lg={4} xl={2} className={"mb-3"}>
                  <InputGroup size={"sm"}>
                    <InputGroup.Text><img src={getUnitIcon(name)} alt={name}/></InputGroup.Text>
                    <Form.Control
                        value={disabled?0:getAmountForUnit(cur, name)}
                        disabled={disabled}
                        onChange={e => setAmountForUnit(result, name, +e.target.value)}
                    />
                  </InputGroup>
                </Col>
            )
          })}
        </Row>
      </Col>
  )
}

function BoostInput({cur, result, values, title, image}: {cur: number, result: StateUpdater<number>, values: number[], title: string | null, image: string}) {
  return (
      <CommandInputWrapper>
        <InputGroup.Text><img src={image} alt={title ?? ""}/></InputGroup.Text>
        <InputGroup.Text>{title}</InputGroup.Text>
        <Form.Select className={"bootstrap-select-custom"} onChange={e => result(+e.target.value)} value={cur}>
          {values.map(val => (
              <option key={val} value={val}>{Math.round(val*100)} %</option>
          ))}
        </Form.Select>
      </CommandInputWrapper>
  )
}

type CommandWithoutTime = Omit<NewCommandListItem, "sendTimestamp" | "arriveTimestamp">
function ButtonsMassDelete({world, worldUnit, list, updateList, newCommand, time, timeType}: {world: worldType,
    worldUnit: worldUnitType, list: CommandList, updateList: StateUpdater<CommandList>, newCommand: CommandWithoutTime, time: number, timeType: TimeType}) {
  const { t } = useTranslation("tool")
  const createToast = useCreateToast()
  const createCommandListItem = useCreateCommandListItem()
  const emptyCommandList = useEmptyCommandList()
  const removeOutdated = useRemoveOutdated()
  const removeSent = useRemoveSent()

  const deleteOutdated = useCallback(async () => {
    removeOutdated(list, updateList)
        .then(() => {
          createToast(t("commandPlanner.overview.create.deleteSuccessTitle"), t("commandPlanner.overview.create.outdatedSuccessDesc"))
        })
  }, [removeOutdated, list, updateList, createToast, t])

  const deleteSent = useCallback(async () => {
    removeSent(list, updateList)
        .then(() => {
          createToast(t("commandPlanner.overview.create.deleteSuccessTitle"), t("commandPlanner.overview.create.sentSuccessDesc"))
        })
  }, [removeSent, list, updateList, createToast, t])

  const deleteAllConfirm = useCallback(async () => {
    const result = await boostrapConfirm(t("commandPlanner.overview.deleteAllConfirm"))
    if(result) {
      emptyCommandList(list, updateList)
          .then(() => {
            createToast(t("commandPlanner.overview.create.emptySuccessTitle"), t("commandPlanner.overview.create.emptySuccessDesc"))
          })
    }
  }, [emptyCommandList, list, updateList, createToast, t])

  const addCommand = useCallback(() => {
    if(newCommand.startVillageId < 0) {
      createToast(t("commandPlanner.overview.create.errorCoordTitle"), t("commandPlanner.overview.create.errorStartCoord"))
      return
    }
    if(newCommand.targetVillageId < 0) {
      createToast(t("commandPlanner.overview.create.errorCoordTitle"), t("commandPlanner.overview.create.errorTargetCoord"))
      return
    }
    if(newCommand.startVillageId === newCommand.targetVillageId) {
      createToast(t("commandPlanner.overview.create.errorCoordTitle"), t("commandPlanner.overview.create.errorCoordSame"))
      return
    }
    appendTimestamps(newCommand, time, timeType, world, worldUnit)
        .then(timedCommand => {
          createCommandListItem(list, updateList, timedCommand)
              .then(() => {
                createToast(t("commandPlanner.overview.create.createSuccessTitle"), t("commandPlanner.overview.create.createSuccessDesc"))
              })
        })
  }, [createCommandListItem, createToast, list, newCommand, t, time, timeType, updateList, world, worldUnit])

  return (
      <Col xs={12}>
        <Button variant={"danger"} size={"sm"} className={"float-start"} onClick={deleteOutdated}>{t("commandPlanner.overview.deleteOutdated")}</Button>
        <Button variant={"warning"} size={"sm"} className={"float-start ms-4"} onClick={deleteSent}>{t("commandPlanner.overview.deleteSent")}</Button>
        <Button variant={"danger"} size={"sm"} className={"float-start ms-4"} onClick={deleteAllConfirm}>{t("commandPlanner.overview.deleteAll")}</Button>
        <Button variant={"success"} size={"sm"} className={"float-end"} onClick={addCommand}>{t("commandPlanner.overview.save")}</Button>
      </Col>
  )
}

function CommandInputWrapper({children}: {children: ReactNode | ReactNode[]}) {
  return (
      <Col xs={12} md={6} lg={4}>
        <InputGroup size={"sm"} className={"mb-3"}>
          {children}
        </InputGroup>
      </Col>
  )
}

function validCls(valid: ValidState) {
  if(valid === ValidState.VALID) return "is-valid"
  if(valid === ValidState.INVALID) return "is-invalid"
  return ""
}

function appendTimestamps(item: CommandWithoutTime, timestamp: number, timeType: TimeType, world: worldType, unitConf: worldUnitType): Promise<NewCommandListItem> {
  if(timeType === TimeType.ARRIVAL) {
    return calculateSendTime({...item, arriveTimestamp: timestamp}, world, unitConf)
  } else {
    return calculateArrivalTime({...item, sendTimestamp: timestamp}, world, unitConf)
  }
}
