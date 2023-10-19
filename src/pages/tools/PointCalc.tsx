import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useExtendedWorldData, useWorldData} from "../../apiInterface/loaders/world"
import {useTranslation} from "react-i18next";
import ErrorPage from "../layout/ErrorPage";
import {WorldDisplayName, worldDisplayNameRaw, worldExtendedType} from "../../modelHelper/World"
import {Card, Col, Form, Row, Table} from "react-bootstrap"

import styles from "./PointCalc.module.scss"
import {
  BuildingName,
  getBuildingBuildTime,
  getBuildingData,
  getBuildingPoints,
  getBuildingPop, getFarmSpace
} from "../../util/dsHelpers/BuildingUtils"
import {BuildingSize, getBuildingImage} from "../../util/dsHelpers/Icon"
import {range} from "../../util/UtilFunctions"
import {Dict} from "../../util/customTypes"


export default function PointCalcPage() {
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const [worldExtendedErr, worldDataExtended] = useExtendedWorldData(server, world)
  const [tUi]  = useTranslation("ui")
  const { t } = useTranslation("tool")

  useEffect(() => {
    if(worldData !== undefined) {
      document.title = worldDisplayNameRaw(tUi, worldData) + ": " + t("pointCalc.title")
    }
  }, [tUi, worldData, t])

  if(worldErr) return <ErrorPage error={worldErr} />
  if(worldExtendedErr) return <ErrorPage error={worldExtendedErr} />

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-none d-lg-block"}>
            <h1 className={"fw-normal"}>
              {t("pointCalc.title") + " "}
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h1>
          </Col>
          <Col className={"p-lg-3 mx-auto my-1 text-center d-lg-none"}>
            <h1 className={"fw-normal"}>
              {t("pointCalc.title") + " "}
            </h1>
            <h4>
              [{worldData && <WorldDisplayName world={worldData} />}]
            </h4>
          </Col>
        </Col>
        <Calculator worldDataExtended={worldDataExtended} />
      </Row>
  )
}

function Calculator({worldDataExtended}: {worldDataExtended: worldExtendedType | undefined}) {
  const [buildingLevels, setBuildingLevels] = useState<Dict<number>>({})
  const { t } = useTranslation("tool")
  let gesFarm = 0, gesPoints = 0

  return (
      <Col xs={12} lg={8} xl={6} className={"mt-2"}>
        <Card>
          <Card.Body>
            <Table className={styles.mainTable + " w-100"}>
              <thead>
              <tr>
                <th>{t("pointCalc.building")}</th>
                <th>{t("pointCalc.level")}</th>
                <th>{t("pointCalc.constructionTime")}</th>
                <th>{t("pointCalc.population")}</th>
                <th>{t("pointCalc.points")}</th>
              </tr>
              </thead>
              <tbody>
              {worldDataExtended?.buildings && Object.keys(worldDataExtended.buildings).map(bName => {
                const data = getBuildingData(bName)
                if(data?.max_level) {
                  const curLevel = buildingLevels[bName] ?? data.min_level
                  const points = getBuildingPoints(bName, curLevel)
                  const pop = bName !== "farm"?-getBuildingPop(bName, curLevel):getFarmSpace(curLevel)
                  const buildTime = getBuildingBuildTime(bName, curLevel, buildingLevels["main"] ?? 1, worldDataExtended.config)
                  gesPoints+= points
                  gesFarm+= pop
                  return (
                      <tr key={bName}>
                        <th><img src={getBuildingImage(bName, BuildingSize.SMALL, 1)} alt={bName} /> <BuildingName nameRaw={bName} /></th>
                        <td>
                          <Form.Select onChange={e => setBuildingLevels(o => {
                            let res = {...o}
                            res[bName] = +e.target.value
                            return res
                          })} value={curLevel}>
                            {range(data.min_level, data.max_level+1).map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                          </Form.Select>
                        </td>
                        <td><ShowTimeDiff diff={buildTime} /></td>
                        <td>{pop}</td>
                        <td>{points}</td>
                      </tr>
                  )
                }
                return undefined
              })}
              <tr>
                <th>{t("pointCalc.points")}</th>
                <td></td>
                <td></td>
                <td>{gesFarm}</td>
                <td>{gesPoints}</td>
              </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
  )
}

function ShowTimeDiff({diff}: {diff: number}) {
  const seconds = diff % 60
  const allMinutes = Math.floor(diff / 60)
  const minutes = allMinutes % 60
  const hours = Math.floor(allMinutes / 60)

  return (
      <>{pad(hours)}:{pad(minutes)}:{pad(seconds)}</>
  )
}

function pad(i: number) {
  return (i < 10) ? '0'+i : i
}
