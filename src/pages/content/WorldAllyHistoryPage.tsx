import {useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {WorldDisplayName, worldDisplayNameRaw} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import {useWorldData} from "../../apiInterface/loaders/world"
import DatatableBase, {DATATABLE_VARIANT, SORTING_DIRECTION} from "../../util/datatables/DatatableBase";
import {worldAllyHistoryTable} from "../../apiInterface/apiConf";
import {dateFormatYMD, ShowHistory} from "../../util/UtilFunctions";
import {allyType, LinkAlly} from "../../modelHelper/Ally";
import DatePicker from "react-datepicker"
import {useAllyDatatableHeader} from "./WorldAllyCurrentPage";
import StatsPage from "../layout/StatsPage";
import {Col} from "react-bootstrap";
import useDatepickerLanguage from "../../util/datepickerLanguage";
import ErrorPage from "../layout/ErrorPage";

export default function WorldAllyHistoryPage() {
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const firstDay = new Date()
  firstDay.setDate(firstDay.getDate() - parseInt(process.env.REACT_APP_BACKEND_DB_SAVE_DAY ?? "1"))
  const [startDate, setStartDate] = useState<Date>(yesterday);
  const { t } = useTranslation("ui")
  const datepickerLang = useDatepickerLanguage()
  const allyHeader = useAllyDatatableHeader()

  useEffect(() => {
    if(worldData) {
      document.title = worldDisplayNameRaw(t, worldData) + ": " + t("server.ranking") + " " + t("title.ally")
    }
  }, [t, worldData])

  if(worldErr) return <ErrorPage error={worldErr} />

  return <StatsPage
      title={
        <>
          {worldData && <WorldDisplayName world={worldData} />}<br />
          {t("table-title.allyRanking")}
        </>
      }
      table={
        <DatatableBase<[allyType, allyType | null]>
            api={worldAllyHistoryTable({server, world})}
            header={allyHeader}
            cells={[
              (a) => <ShowHistory name={t("old.rank")} o_dat={a[1]?.rank} n_dat={a[0].rank} invert />,
              (a) => <>{worldData && <LinkAlly ally={a[0]} world={worldData} />}</>,
              (a) => <>{worldData && <LinkAlly ally={a[0]} world={worldData} useTag />}</>,
              (a) => <ShowHistory name={t("old.points")} tsd_format o_dat={a[1]?.points} n_dat={a[0].points} />,
              (a) => <ShowHistory name={t("old.member_count")} o_dat={a[1]?.member_count} n_dat={a[0].member_count} />,
              (a) => <ShowHistory name={t("old.village_count")} o_dat={a[1]?.village_count} n_dat={a[0].village_count} />,
              (a) => <ShowHistory name={t("old.player_points")} tsd_format o_dat={(a[1] === null)?undefined:((a[1].member_count === 0)?(0):(a[1].points / a[1].member_count))} n_dat={(a[0].member_count === 0)?(0):(a[0].points / a[0].member_count)} />,
              (a) => <ShowHistory name={t("old.gesBash")} tsd_format o_dat={a[1]?.gesBash} n_dat={a[0].gesBash} />,
              (a) => <ShowHistory name={t("old.offBash")} tsd_format o_dat={a[1]?.offBash} n_dat={a[0].offBash} />,
              (a) => <ShowHistory name={t("old.defBash")} tsd_format o_dat={a[1]?.defBash} n_dat={a[0].defBash} />,
            ]}
            cellClasses={["", "", "", "text-end", "text-end", "", "text-end", "text-end", "text-end", "text-end"]}
            keyGen={a => a[0].allyID}
            variant={DATATABLE_VARIANT.SERVER_SIDE}
            defaultSort={["rank", SORTING_DIRECTION.ASC]}
            saveAs={'worldAllyHist'}
            responsiveTable
            api_params={{day: dateFormatYMD(startDate)}}
            topBarMiddle={(
                <Col xs={12} md={"auto"} className={"ms-md-auto mb-2"}>
                  <DatePicker
                      selected={startDate}
                      onChange={(date) => date?setStartDate(date):undefined}
                      minDate={firstDay}
                      maxDate={yesterday}
                      className={"form-control"}
                      locale={datepickerLang}
                  />
                </Col>
            )}
            searching
        />
      }
  />
};
