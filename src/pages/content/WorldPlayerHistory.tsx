import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {WorldDisplayName, worldType} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import {getWorldData} from "../../apiInterface/loadContent";
import DatatableBase, {SORTING_DIRECTION} from "../../util/datatables/DatatableBase";
import {worldPlayerHistoryTable} from "../../apiInterface/apiConf";
import {dateFormatYMD, ShowHistory} from "../../util/UtilFunctions";
import DatePicker from "react-datepicker"
import {PlayerDatatableHeader} from "./WorldPlayerCurrent";
import {LinkPlayer, LinkPlayerAlly, playerPureType, playerType} from "../../modelHelper/Player";

export default function WorldPlayerHistoryPage() {
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
        <h2>{t("table-title.playerRanking")}</h2>
        <DatatableBase<[playerType, playerPureType | null]>
            api={worldPlayerHistoryTable({server, world})}
            header={PlayerDatatableHeader(t)}
            cells={[
              (p) => <ShowHistory name={t("old.rank")} o_dat={p[1]?.rank} n_dat={p[0].rank} invert />,
              (p) => <>{dataWorld && <LinkPlayer player={p[0]} world={dataWorld} />}</>,
              (p) => <>{dataWorld && <LinkPlayerAlly player={p[0]} world={dataWorld} />}</>,
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
