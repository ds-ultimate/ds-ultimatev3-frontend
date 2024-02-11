import {worldType} from "../../../modelHelper/World"
import {useTranslation} from "react-i18next"
import React, {useContext, useEffect, useMemo, useState} from "react"
import {playerType} from "../../../modelHelper/Player"
import {villagePlayerType, villagePureType} from "../../../modelHelper/Village"
import {dateFormatLocal_DMY_HMS, nf} from "../../../util/UtilFunctions"
import {Button, Card, Form, InputGroup} from "react-bootstrap"
import {LoadingScreenContext} from "../../layout/LoadingScreen"
import {useErrorBoundary} from "react-error-boundary"
import {allyPlayerTable, allyPlayerVillageTable, playerVillageTable} from "../../../apiInterface/apiConf"
import axios from "axios"
import {columnOptionType} from "../TableGeneratorPage"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faCopy} from "@fortawesome/free-solid-svg-icons"


type outputTypes = {
  worldData: worldType,
  selectedType: string | undefined,
  sorting: string,
  columns: columnOptionType,
  emptyColumnCnt: number,
  selectedBaseEntry: number | undefined,
}

const MAX_BRACKETS = 1000

export function TableGeneratorOutput({worldData, selectedType, sorting, columns, emptyColumnCnt, selectedBaseEntry}: outputTypes) {
  const { t } = useTranslation("tool")
  const rawData = useRawData(selectedType, worldData, selectedBaseEntry)
  const [mappedData, mappedHeader] = useMemo(() => {
    if(rawData === undefined || selectedType === undefined) return [undefined, undefined]
    let entries: undefined | Array<{columns: string[], name: string, points: number, villages?: number}> = undefined
    let mappedHeader: string[] | undefined = undefined
    if(selectedType === "playerByAlly") {
      //playerType --> Columns: NR, Player, Points, 120% down, 120% up, [additional]
      entries = (rawData as playerType[]).map(v =>
          ({name: v.name, points: v.points, villages: v.village_count, columns: [`[player]${v.name}[/player]`]}))
      mappedHeader = [t("tableGenerator.table.player")]
    } else if(selectedType === "villageByPlayer") {
      //villagePureType --> Columns: NR, Village([coord]123|123[/coord]), Points, [additional]
      entries = (rawData as villagePureType[]).map(v =>
          ({name: v.name, points: v.points, columns: [`[coord]${v.x}|${v.y}[/coord]`]}))
      mappedHeader = [t("tableGenerator.table.village")]
    } else if(selectedType === "villageByAlly") {
      //villagePlayerType --> Columns: NR, Village([coord]123|123[/coord]), Points, [additional]
      entries = (rawData as villagePlayerType[]).map(v =>
          ({name: v.name, points: v.points, columns: [`[coord]${v.x}|${v.y}[/coord]`]}))
      mappedHeader = [t("tableGenerator.table.village")]
    } else if(selectedType === "villageAndPlayerByAlly") {
      //villagePlayerType --> Columns: NR, Player, Village([coord]123|123[/coord]), Points, [additional]
      entries = (rawData as villagePlayerType[]).map(v =>
          ({name: v.playerLatest__name??"", points: v.points, columns: [
              `[player]${v.playerLatest__name}[/player]`, `[coord]${v.x}|${v.y}[/coord]`]}))
      mappedHeader = [t("tableGenerator.table.village"), t("tableGenerator.table.player")]
    }

    if(entries === undefined || mappedHeader === undefined) return [undefined, undefined]
    if(columns.lineNumbers) {
      mappedHeader = [t("tableGenerator.table.lineNr"), ...mappedHeader]
    }
    if(columns.points) {
      mappedHeader = [...mappedHeader, t("tableGenerator.table.points")]
    }
    if(columns.villageCount && selectedType === "playerByAlly") {
      mappedHeader = [...mappedHeader, t("tableGenerator.table.villageCount")]
    }
    if(columns.casualPointRange && selectedType === "playerByAlly") {
      mappedHeader = [...mappedHeader, t("tableGenerator.table.casualDown"), t("tableGenerator.table.casualUp")]
    }
    mappedHeader = [...mappedHeader, ...(Array(emptyColumnCnt))]

    return [entries.map((e, idx) => {
      let cols = e.columns
      if(columns.lineNumbers) {
        cols = [nf.format(idx), ...cols]
      }
      if(columns.points) {
        cols = [...cols, nf.format(e.points)]
      }
      if(columns.villageCount && selectedType === "playerByAlly") {
        cols = [...cols, nf.format(e.villages ?? 0)]
      }
      if(columns.casualPointRange && selectedType === "playerByAlly") {
        cols = [...cols, nf.format(e.points / 1.2), nf.format(e.points * 1.2)]
      }
      cols = [...cols, ...(Array(emptyColumnCnt))]
      return {...e, columns: cols}
    }), mappedHeader]
  }, [rawData, selectedType, emptyColumnCnt, columns, t])

  const sortedData = useMemo(() => {
    if(mappedData === undefined) return undefined
    const sortedData = mappedData.slice()
    if(sorting === "name") {
      sortedData.sort((a,b) => a.name.localeCompare(b.name))
    } else if(sorting === "points") {
      sortedData.sort((a,b) => a.points-b.points)
    }
    return sortedData
  }, [mappedData, sorting])

  const result = useMemo(() => {
    if(sortedData === undefined || mappedHeader === undefined) return undefined
    const result: string[] = []
    const pre = "[quote][table]\n[**]" + mappedHeader.join("[||]") + "[/**]\n"
    const after = `[/table]\n[i][b]Stand[/b]: ${dateFormatLocal_DMY_HMS(new Date())}[/i] || ${t("tableGenerator.table.sig", {link: "[url=https://ds-ultimate.de]DS-Ultimate[/url]"})}[/quote]`
    const afterCnt = countBrackets(after)

    let current = pre
    sortedData.forEach(value => {
      const entry = "[*]" + value.columns.join("[|]") + "\n"
      if(countBrackets(entry) + countBrackets(current) + afterCnt >= MAX_BRACKETS) {
        result.push(current + after)
        current = pre
      }
      current+= entry
    })
    result.push(current + after)
    return result
  }, [sortedData, mappedHeader, t])

  return (
      <Card className={"h-100"}>
        <Card.Body>
          {result === undefined || result.length < 2?(
              <textarea
                  className={"w-100 h-100"}
                  style={{resize: "none"}}
                  value={(result === undefined || result.length < 1)?"":result[0]}
                  readOnly
              />
          ):(
              <>
                {t("tableGenerator.maxSing").split("\n").map((v, idx) => (
                    <React.Fragment key={idx}>
                      {v}
                      <br />
                    </React.Fragment>
                ))}
                {result.map((res, idx) => (
                    <InputGroup className={"mt-2"} key={idx}>
                      <Form.Control value={res} readOnly />
                      <Button onClick={() => navigator.clipboard.writeText(res)}><FontAwesomeIcon icon={faCopy} /></Button>
                    </InputGroup>
                ))}
              </>
          )}
        </Card.Body>
      </Card>
  )
}

function useRawData(selectedType: string | undefined, worldData: worldType | undefined, selectedBaseEntry: number | undefined) {
  const [rawData, setRawData] = useState<any[] | undefined>(undefined)
  const setLoading = useContext(LoadingScreenContext)
  const { showBoundary } = useErrorBoundary()

  useEffect(() => {
    if(selectedType === undefined || worldData === undefined || selectedBaseEntry === undefined || selectedBaseEntry <= 0) {
      setRawData(undefined)
      return
    }

    let api: string|undefined = undefined
    if(selectedType === "playerByAlly") {
      api = allyPlayerTable({server: worldData.server__code, world: worldData.name, ally: (selectedBaseEntry + "")})
    } else if(selectedType === "villageByPlayer") {
      api = playerVillageTable({server: worldData.server__code, world: worldData.name, player: (selectedBaseEntry + "")})
    } else if(selectedType === "villageByAlly" || selectedType === "villageAndPlayerByAlly") {
      api = allyPlayerVillageTable({server: worldData.server__code, world: worldData.name, ally: (selectedBaseEntry + "")})
    }
    if(api === undefined) {
      setRawData(undefined)
      return
    }
    let mounted = true
    setLoading(true, "TableGenerator")

    axios.get(api)
        .then((resp) => {
          setLoading(false, "TableGenerator")
          if(mounted) {
            setRawData(resp.data.data)
          }
        })
        .catch((reason) => {
          setLoading(false, "TableGenerator")
          setRawData(undefined)
          showBoundary(reason)
        })
    return () => {
      mounted = false
    }
  }, [setLoading, showBoundary, worldData, selectedBaseEntry, selectedType, setRawData])
  return rawData
}

function countBrackets(d: string) {
  return (d.match(/\[/g) || []).length
}