import {useParams} from "react-router-dom";
import React, {useState} from "react";
import {WorldDisplayName} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import {useWorldData} from "../../apiInterface/loadContent";
import DatatableBase, {SORTING_DIRECTION} from "../../util/datatables/DatatableBase";
import {worldPlayerHistoryTable} from "../../apiInterface/apiConf";
import {dateFormatYMD, ShowHistory} from "../../util/UtilFunctions";
import DatePicker from "react-datepicker"
import {PlayerDatatableHeader} from "./WorldPlayerCurrent";
import {LinkPlayer, LinkPlayerAlly, playerPureType, playerType} from "../../modelHelper/Player";
import {Card, Col, Row} from "react-bootstrap";
import useDatepickerLanguage from "../../util/datepickerLanguage";

export default function WorldPlayerHistoryPage() {
  const {server, world} = useParams()
  const worldData = useWorldData(server, world)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const firstDay = new Date()
  firstDay.setDate(firstDay.getDate() - parseInt(process.env.REACT_APP_BACKEND_DB_SAVE_DAY ?? "1"))
  const [startDate, setStartDate] = useState<Date>(yesterday);
  const { t } = useTranslation("ui")

  return (
      <Row className="justify-content-center">
        <Col xs={12}>
          <Col md={5} className={"p-lg-5 mx-auto my-1 text-center"}>
            <h1 className={"fw-normal"}>
              {worldData && <WorldDisplayName world={worldData} />}<br />
              {t("table-title.playerRanking")}
            </h1>
          </Col>
        </Col>
        <Col xs={12} className={"mt-2"}>
          <Card>
            <Card.Body>
              <DatatableBase<[playerType, playerPureType | null]>
                  api={worldPlayerHistoryTable({server, world})}
                  header={PlayerDatatableHeader(t)}
                  cells={[
                    (p) => <ShowHistory name={t("old.rank")} o_dat={p[1]?.rank} n_dat={p[0].rank} invert />,
                    (p) => <>{worldData && <LinkPlayer player={p[0]} world={worldData} />}</>,
                    (p) => <>{worldData && <LinkPlayerAlly player={p[0]} world={worldData} />}</>,
                    (p) => <ShowHistory name={t("old.points")} o_dat={p[1]?.points} n_dat={p[0].points} />,
                    (p) => <ShowHistory name={t("old.village_count")} o_dat={p[1]?.village_count} n_dat={p[0].village_count} />,
                    (p) => <ShowHistory name={t("old.village_points")} o_dat={(p[1] === null)?undefined:((p[1].village_count === 0)?(0):(p[1].points / p[1].village_count))} n_dat={(p[0].village_count === 0)?(0):(p[0].points / p[0].village_count)} />,
                    (p) => <ShowHistory name={t("old.gesBash")} o_dat={p[1]?.gesBash} n_dat={p[0].gesBash} />,
                    (p) => <ShowHistory name={t("old.offBash")} o_dat={p[1]?.offBash} n_dat={p[0].offBash} />,
                    (p) => <ShowHistory name={t("old.defBash")} o_dat={p[1]?.defBash} n_dat={p[0].defBash} />,
                    (p) => <ShowHistory name={t("old.supBash")} o_dat={p[1]?.supBash} n_dat={p[0].supBash} />,
                  ]}
                  keyGen={p => p[0].playerID}
                  serverSide
                  defaultSort={["rank", SORTING_DIRECTION.ASC]}
                  saveAs={'worldPlayerHist'}
                  api_params={{day: dateFormatYMD(startDate)}}
                  topBarMiddle={(
                      <Col xs={12} md={"auto"} className={"ms-md-auto mb-2"}>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => date?setStartDate(date):undefined}
                            minDate={firstDay}
                            maxDate={yesterday}
                            className={"form-control"}
                            locale={useDatepickerLanguage()}
                        />
                      </Col>
                  )}
                  responsiveTable
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
};
