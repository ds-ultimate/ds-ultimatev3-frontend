import {worldType} from "../../../modelHelper/World";
import React, {Key, ReactNode, useState} from "react";
import {dateFormatLocal_DMY} from "../../../util/UtilFunctions";
import {useTranslation} from "react-i18next";
import {Card, Col, Table} from "react-bootstrap";
import styles from "./record.module.scss";
import {useBreakpointUp} from "../../../util/bootrapBreakpoints";
import CustomChart, {chartDataType} from "../../../util/CustomChart";
import {MatomoLink} from "../../../matomo"

export function LinkAllyInGame({ally_id, worldData, guestMode, children}: {ally_id: number, worldData: worldType, guestMode?: boolean, children: ReactNode}) {
  const guestPart = guestMode?"guest":"game"
  const href = `${worldData.url}/${guestPart}.php?screen=info_ally&id=${ally_id}`

  return (
      <MatomoLink as={"a"} params={{href, target: "_blank", className: "btn btn-primary btn-sm ms-1", rel: "noreferrer"}}>
        {children}
      </MatomoLink>
  )
}

export function LinkPlayerInGame({player_id, worldData, guestMode, children}: {player_id: number, worldData: worldType, guestMode?: boolean, children: ReactNode}) {
  const guestPart = guestMode?"guest":"game"
  const href = `${worldData.url}/${guestPart}.php?screen=info_player&id=${player_id}`

  return (
      <MatomoLink as={"a"} params={{href, target: "_blank", className: "btn btn-primary btn-sm ms-1", rel: "noreferrer"}}>
        {children}
      </MatomoLink>
  )
}

export function LinkVillageInGame({village_id, worldData, guestMode, children}: {village_id: number, worldData: worldType, guestMode?: boolean, children: ReactNode}) {
  const guestPart = guestMode?"guest":"game"
  const href = `${worldData.url}/${guestPart}.php?screen=info_village&id=${village_id}`

  return (
      <MatomoLink as={"a"} params={{href, target: "_blank", className: "btn btn-primary btn-sm ms-1", rel: "noreferrer"}}>
        {children}
      </MatomoLink>
  )
}

export function TopElement({val, date, bp}: {val: ReactNode, date: string, bp?: string}) {
  const {t} = useTranslation("ui")
  bp = bp ?? "xl"
  const isBiggerThanXL = useBreakpointUp(bp)

  if(isBiggerThanXL) {
    return (
        <>
          {val}<br />
          <span className={"small float-end"}>{t("topAt") + " "}{dateFormatLocal_DMY(new Date(date))}</span>
        </>
    )
  }
  return (
      <>
        {val} ({t("topAt") + " "}{dateFormatLocal_DMY(new Date(date))})
      </>
  )
}

export function ChartSection({charts, title, single}: {charts: Array<[boolean, chartDataType | undefined, ReactNode]>, title: ReactNode, single?:boolean}) {
  const [selected, setSelected] = useState(0)
  const [inverted, selectedChart] = charts[selected]

  return (
      <Col xs={12} lg={single?12:6} className={"mt-3"}>
        <Card>
          <Card.Body>
            <Card.Title as={"h4"}>{title}</Card.Title>
            <select onChange={newValue => setSelected(+newValue.target.value)}>
              {charts.map(([_val, _t, opt], idx) => <option key={idx} value={idx}>{opt}</option>)}
            </select>
            <CustomChart data={selectedChart} inverted={inverted} />
          </Card.Body>
        </Card>
      </Col>
  )
}

type tableRowData = [Key, ReactNode, ReactNode]
export function ResponsiveRecordTable({title, tableData, breakpoint}: {title: ReactNode, tableData: tableRowData[], breakpoint: string}) {
  const isBiggerThanXL = useBreakpointUp(breakpoint)

  if(isBiggerThanXL) {
    return (
        <Col xs={12} className={"mt-3"}>
          <Card.Subtitle as={"h5"}>{title}</Card.Subtitle>
          <Table bordered className={"nowrap w-100"}>
            <thead>
            <tr>
              {tableData.map(value => <th key={value[0]}>{value[1]}</th>)}
            </tr>
            </thead>
            <tbody>
            <tr>
              {tableData.map(value => <td key={value[0]}>{value[2]}</td>)}
            </tr>
            </tbody>
          </Table>
        </Col>
    )
  }

  return (
      <Col xs={12} className={"mt-3 table-responsive"}>
        <Card.Subtitle as={"h5"}>{title}</Card.Subtitle>
        <Table striped className={"nowrap w-100 " + styles.tblStretched}>
          <tbody>
          {tableData.map(value => <tr key={value[0]}>
            <th>{value[1]}</th>
            <td>{value[2]}</td>
          </tr>)}
          </tbody>
        </Table>
      </Col>
  )
}

type tableDualHeaderData = {
  header: ReactNode,
  columns: tableRowData[],
}
export function ResponsiveMultiRecordTable({title, tableData, breakpoint}: {title: ReactNode, tableData: Array<tableDualHeaderData[]>, breakpoint: string}) {
  const isBiggerThanXL = useBreakpointUp(breakpoint)

  if(isBiggerThanXL) {
    return (
        <Col xs={12} className={"mt-3"}>
          <Card.Subtitle as={"h5"}>{title}</Card.Subtitle>
          {tableData.map((headers, tbl_idx) =>
              <Table bordered className={"nowrap w-100"} key={tbl_idx}>
                <thead>
                <tr>
                  {headers.map((sHeaders, mHeader_idx) =>
                      <th key={mHeader_idx} colSpan={sHeaders.columns.length}>{sHeaders.header}</th>
                  )}
                </tr>
                <tr>
                  {headers.map(sHeaders =>
                      sHeaders.columns.map(sHeader =>
                          <th key={sHeader[0]}>{sHeader[1]}</th>
                      )
                  ).flat()}
                </tr>
                </thead>
                <tbody>
                <tr>
                  {headers.map(sHeaders =>
                      sHeaders.columns.map(sHeader =>
                          <th key={sHeader[0]}>{sHeader[2]}</th>
                      )
                  ).flat()}
                </tr>
                </tbody>
              </Table>
          )}
        </Col>
    )
  }

  return (
      <Col xs={12} className={"mt-3 table-responsive"}>
        <Card.Subtitle as={"h5"}>{title}</Card.Subtitle>
        {tableData.map((headers, tbl_idx) =>
            headers.map((sHeaders, mHeader_idx) =>
                <Table key={tbl_idx + "_" + mHeader_idx} striped className={"nowrap w-100 " + styles.tblStretched}>
                  <thead>
                  <tr>
                    <th colSpan={sHeaders.columns.length}>{sHeaders.header}</th>
                  </tr>
                  <tr>
                    {sHeaders.columns.map(sHeader =>
                        <th key={sHeader[0]}>{sHeader[1]}</th>
                    )}
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    {sHeaders.columns.map(sHeader =>
                        <th key={sHeader[0]}>{sHeader[2]}</th>
                    )}
                  </tr>
                  </tbody>
                </Table>
            )
        ).flat()}
      </Col>
  )
}
