import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {WorldDisplayName, worldType} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import {getWorldData} from "../../apiInterface/loadContent";
import DatatableBase, {SORTING_DIRECTION} from "../../util/datatables/DatatableBase";
import {worldAllyHistoryTable} from "../../apiInterface/apiConf";
import {dateFormatYMD, ShowHistory} from "../../util/UtilFunctions";
import {allyType, LinkAlly} from "../../modelHelper/Ally";
import DatePicker from "react-datepicker"
import {AllyDatatableHeader} from "./WorldAllyCurrent";

export default function WorldAllyHistoryPage() {
  const {server, world} = useParams()
  const [dataWorld, setDataWorld] = useState<worldType>()
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const firstDay = new Date()
  firstDay.setDate(firstDay.getDate() - parseInt(process.env.REACT_APP_BACKEND_DB_SAVE_DAY ?? "1"))
  const [startDate, setStartDate] = useState<Date>(yesterday);
  const { t } = useTranslation("ui")

  useEffect(() => {
    let mounted = true
    if(server === undefined || world === undefined) {
      setDataWorld(undefined)
    } else {
      getWorldData(server, world)
          .then(data => {
            if(mounted) {
              setDataWorld(data)
            }
          })
    }
    return () => {
      mounted = false
    }
  }, [server, world])

  return (
      <>
        <h1>{dataWorld && <WorldDisplayName world={dataWorld} />}</h1>
        <h2>{t("table-title.allyRanking")}</h2>
        <DatatableBase<[allyType, allyType | null]>
            api={worldAllyHistoryTable({server, world})}
            header={AllyDatatableHeader(t)}
            cells={[
              (a) => <ShowHistory name={t("old.rank")} o_dat={a[1]?.rank} n_dat={a[0].rank} invert />,
              (a) => <>{dataWorld && <LinkAlly ally={a[0]} world={dataWorld} />}</>,
              (a) => <>{dataWorld && <LinkAlly ally={a[0]} world={dataWorld} useTag />}</>,
              (a) => <ShowHistory name={t("old.points")} o_dat={a[1]?.points} n_dat={a[0].points} />,
              (a) => <ShowHistory name={t("old.member_count")} o_dat={a[1]?.member_count} n_dat={a[0].member_count} />,
              (a) => <ShowHistory name={t("old.village_count")} o_dat={a[1]?.village_count} n_dat={a[0].village_count} />,
              (a) => <ShowHistory name={t("old.player_points")} o_dat={(a[1] === null)?undefined:((a[1].member_count === 0)?(0):(a[1].points / a[1].member_count))} n_dat={(a[0].member_count === 0)?(0):(a[0].points / a[0].member_count)} />,
              (a) => <ShowHistory name={t("old.gesBash")} o_dat={a[1]?.gesBash} n_dat={a[0].gesBash} />,
              (a) => <ShowHistory name={t("old.offBash")} o_dat={a[1]?.offBash} n_dat={a[0].offBash} />,
              (a) => <ShowHistory name={t("old.defBash")} o_dat={a[1]?.defBash} n_dat={a[0].defBash} />,
            ]}
            keyGen={a => a[0].allyID}
            serverSide
            defaultSort={["rank", SORTING_DIRECTION.ASC]}
            saveAs={'worldAllyHist'}
            api_params={{day: dateFormatYMD(startDate)}}
            topBarMiddle={(
                <DatePicker
                    selected={startDate}
                    onChange={(date) => date?setStartDate(date):undefined}
                    minDate={firstDay}
                    maxDate={yesterday}
                />
            )}
        />
      </>
  )
};
