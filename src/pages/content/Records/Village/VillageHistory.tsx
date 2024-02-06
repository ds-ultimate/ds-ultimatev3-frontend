import {useTranslation} from "react-i18next";

import React, {useMemo} from "react";
import {Card, Col, Row, Table, Tooltip} from "react-bootstrap";
import {worldType} from "../../../../modelHelper/World";
import {villageBasicDataType} from "../../../../modelHelper/Village";
import ErrorPage from "../../../layout/ErrorPage";
import {getPointBuildingMap} from "../../../../util/dsHelpers/BuildingUtils";
import {BuildingSize, getBuildingImage} from "../../../../util/dsHelpers/Icon";
import {CustomTooltip} from "../../../../util/UtilFunctions";
import {useExtendedWorldData} from "../../../../apiInterface/loaders/world"

type paramType = {
  villageData: villageBasicDataType,
  worldData: worldType,
}

export default function VillageHistory({villageData, worldData}: paramType) {
  const {t} = useTranslation("ui")
  const [worldExtendErr, worldExtend] = useExtendedWorldData(worldData.server__code, worldData.name)

  const pointMap = useMemo(() => {
    if(worldExtend === undefined || worldExtend.buildings === null) return {}
    return getPointBuildingMap(worldExtend.buildings)
  }, [worldExtend])

  if(worldExtendErr) return <ErrorPage error={worldExtendErr} />

  const hist = villageData.history.map((dat, idx) => {
    const d1 = (new Date(dat[0])).getTime()
    const d2 = (idx > 0)?(new Date(villageData.history[idx-1][0])).getTime():null
    const diff = (idx > 0)?dat[1] - villageData.history[idx-1][1]:dat[1]
    return {
      date: dat[0],
      points: dat[1],
      diff: diff,
      d_time: (d2 === null)?null:(d1-d2)/1000,
      possible: (diff !== null)?pointMap[diff]:null,
    }
  })
  hist.reverse()

  return (
      <Row className={"justify-content-center table-responsive"}>
        <Col xs={12} className={"mt-3"}>
          <Card>
            <Card.Body>
              <Card.Title as={"h4"}>{t("table-title.history")}</Card.Title>
              <Table striped hover className={"nowrap"}>
                <thead>
                <tr>
                  <th className={"text-end"}>{t("table.date")}</th>
                  <th className={"text-center"}>{t("table.points")}</th>
                  <th className={"text-center"}>{t("table.time")}</th>
                  <th className={"text-center"}>{t("table.possibleChanges")}</th>
                </tr>
                </thead>
                <tbody>
                {hist.map((dat, idx) => (
                    <tr key={idx}>
                      <td className={"text-end"}>{dat.date}</td>
                      <td className={"text-center"}>{dat.points}{dat.diff !== null && (
                          <span className={dat.diff>0?"text-success":(dat.diff<0?"text-danger":"")}> ({dat.diff>0?"+"+dat.diff:dat.diff})</span>
                      )}</td>
                      <td className={"text-center"}>{dat.d_time?Math.round(dat.d_time / 3600) + "h":"-"}</td>
                      <td className={"text-center"}>{
                        dat.possible?
                        (<VillageHistoryElement possible={dat.possible}></VillageHistoryElement>):
                        (t("village.histUnknown"))
                      }</td>
                    </tr>
                ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}

function VillageHistoryElement({possible}: {possible: Array<[string, number]>}) {
  const {t} = useTranslation("ui")

  if(possible.length <= 1) {
    const buildName = t("buildings." + possible[0][0]) ?? null
    return <>
      <img src={getBuildingImage(possible[0][0], BuildingSize.SMALL, 1)} alt={buildName}/>
      {buildName} {possible[0][1]}
    </>
  }

  return <>
    <CustomTooltip overlay={(
        <Tooltip>
          {possible.map(p => {
            const buildName = t("buildings." + p[0])
            return <React.Fragment key={p[0] + p[1]}>
              <img src={getBuildingImage(p[0], BuildingSize.SMALL, 1)} alt={buildName}/> {buildName} ({p[1]})<br />
            </React.Fragment>
          })}
        </Tooltip>
    )} delayHide={200} delayShow={0} placement={"right"}>
      <span>
        {possible.length} {t("village.histPossibilities")}
      </span>
    </CustomTooltip>
  </>
}
