import {CommandList, commandPlannerUnitName} from "../../../../modelHelper/Tool/CommandList"
import {useTranslation} from "react-i18next"
import {Col, Row} from "react-bootstrap"
import {nf} from "../../../../util/UtilFunctions"
import React, {useMemo} from "react"
import {get_icon, getUnitIcon} from "../../../../util/dsHelpers/Icon"


export default function CommandStatsTab({list}: {list: CommandList}) {
  const { t } = useTranslation("tool")

  const {startVillages, targetVillages, bySlowestUnit, byType} = useMemo(() => {
    const startVillages = unique(list.items.map(value => value.startVillageId))
    const targetVillages = unique(list.items.map(value => value.targetVillageId))
    const bySlowestUnit = countGrouped(list.items.map(value => value.unit)).sort((a, b) => a[0] - b[0])
    const byType = countGrouped(list.items.map(value => value.type)).sort((a, b) => a[0] - b[0])
    return {startVillages, targetVillages, bySlowestUnit, byType}
  }, [list])

  return (
      <Row className={"pt-3"}>
        <Col xs={1} className={"d-none d-lg-block"}></Col>
        <Col xs={12} md={6} lg={4} className={"mb-4"}>
          <h3>{t("commandPlanner.overview.stats.generalTitle")}</h3>
          {t("commandPlanner.overview.stats.attackTotal")}: <b>{nf.format(list.items.length)}</b><br />
          {t("commandPlanner.overview.stats.attackStartVillage")}: <b>{nf.format(startVillages.size)}</b><br />
          {t("commandPlanner.overview.stats.attackTargetVillage")}: <b>{nf.format(targetVillages.size)}</b><br />
        </Col>
        <Col xs={1} className={"d-none d-lg-block"}></Col>
        <Col xs={6} md={3} lg={2}>
          <h3>{t("commandPlanner.overview.prop.unit")}</h3>
          {bySlowestUnit.map(([uIdx, cnt]) => {
            return <React.Fragment key={uIdx}>
              <img src={getUnitIcon(commandPlannerUnitName[uIdx])} alt={commandPlannerUnitName[uIdx]} /> - {t("total")} <b>{nf.format(cnt)}</b><br />
            </React.Fragment>
          })}
        </Col>
        <Col xs={1} className={"d-none d-lg-block"}></Col>
        <Col xs={6} md={3} lg={2}>
          <h3>{t("commandPlanner.overview.prop.type")}</h3>
          {byType.map(([iconIdx, cnt]) => {
            return <React.Fragment key={iconIdx}>
              <img src={get_icon(iconIdx)} alt={""+iconIdx} /> - {t("total")} <b>{nf.format(cnt)}</b><br />
            </React.Fragment>
          })}
        </Col>
      </Row>
  )
}

function unique(data: number[]) {
  return data.reduce((prev, cur) => prev.add(cur), new Set<number>())
}

function countGrouped(data: number[]) {
  return data.reduce((prev, cur): Array<[number, number]> => {
    const found = prev.findIndex(([u,]) => u === cur)
    if(found === -1) {
      return [...prev, [cur, 1]]
    }
    return [...prev.slice(0, found), ...prev.slice(found+1), [cur, prev[found][1]+1]]
  }, [] as Array<[number, number]>)
}
