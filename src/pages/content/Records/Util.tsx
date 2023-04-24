import {worldType} from "../../../modelHelper/World";
import {Key, ReactNode} from "react";
import {dateFormatLocal} from "../../../util/UtilFunctions";
import {useTranslation} from "react-i18next";
import {Card, Col, Table} from "react-bootstrap";
import styles from "./record.module.scss";
import {useBreakpointUp} from "../../../util/bootrapBreakpoints";

export function LinkAllyInGame({ally_id, worldData, guestMode, children}: {ally_id: number, worldData: worldType, guestMode?: boolean, children: ReactNode}) {
  const guestPart = guestMode?"guest":"game"
  const href = `${worldData.url}/${guestPart}.php?screen=info_ally&id=${ally_id}`

  return (
      <a href={href} target={"_blank"} className={"btn btn-primary btn-sm ms-1"} rel={"noreferrer"}>
        {children}
      </a>
  )
}

export function TopElement({val, date}: {val: ReactNode, date: string}) {
  const {t} = useTranslation("ui")
  const isBiggerThanXL = useBreakpointUp("xl")

  if(isBiggerThanXL) {
    return (
        <>
          {val}<br />
          <span className={"small float-end"}>{t("topAt") + " "}{dateFormatLocal(new Date(date))}</span>
        </>
    )
  }
  return (
      <>
        {val} ({t("topAt") + " "}{dateFormatLocal(new Date(date))})
      </>
  )
}

export function ResponsiveRecordTable({title, tableData}: {title: ReactNode, tableData: Array<[Key, ReactNode, ReactNode]>}) {
  const isBiggerThanXL = useBreakpointUp("xl")

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
