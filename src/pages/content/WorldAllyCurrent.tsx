import {useParams} from "react-router-dom";
import {WorldDisplayName} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import {useWorldData} from "../../apiInterface/loadContent";
import DatatableBase, {SORTING_DIRECTION} from "../../util/datatables/DatatableBase";
import {worldAllyCurrentTable} from "../../apiInterface/apiConf";
import {nf, thousandsFormat} from "../../util/UtilFunctions";
import {allyType, LinkAlly} from "../../modelHelper/Ally";
import DatatableHeaderBuilder from "../../util/datatables/DatatableHeaderBuilder";
import StatsPage from "../layout/StatsPage";
import ErrorPage from "../layout/ErrorPage";
import {useMemo} from "react";

export function useAllyDatatableHeader() {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder()
        .addRow(row => {
          row.addCell({colSpan: 7, useConcat: false, title: t('table-title.general')})
          row.addCell({colSpan: 4, title: t('table-title.bashStats')})
        })
        .addMainRow(row => {
          row.addCell({sortBy: "rank", title: t('table.rank')})
          row.addCell({sortBy: "name", title: t('table.name')})
          row.addCell({sortBy: "tag", title: t('table.tag')})
          row.addCell({sortBy: "points", sortDescDefault: true, title: t('table.points')})
          row.addCell({sortBy: "member_count", sortDescDefault: true, title: t('table.members')})
          row.addCell({sortBy: "village_count", sortDescDefault: true, title: t('table.villages')})
          row.addCell({showAt: "md", title: t('table.avgPlayer')})
          row.addCell({showAt: "lg", sortBy: "gesBash", sortDescDefault: true, title: t('table.bashGes')})
          row.addCell({showAt: "lg", sortBy: "offBash", sortDescDefault: true, title: t('table.bashOff')})
          row.addCell({showAt: "lg", sortBy: "defBash", sortDescDefault: true, title: t('table.bashDef')})
        })
  }, [t])
}

export default function WorldAllyCurrentPage() {
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const { t } = useTranslation("ui")
  const allyHeader = useAllyDatatableHeader()

  if(worldErr) return <ErrorPage error={worldErr} />

  return <StatsPage
      title={
        <>
          {worldData && <WorldDisplayName world={worldData} />}<br />
          {t("table-title.overview")} {t("table-title.ally")}
        </>
      }
      table={
        <DatatableBase<allyType>
            api={worldAllyCurrentTable({server, world})}
            header={allyHeader}
            cells={[
              (a) => nf.format(a.rank),
              (a) => <>{worldData && <LinkAlly ally={a} world={worldData} />}</>,
              (a) => <>{worldData && <LinkAlly ally={a} world={worldData} useTag />}</>,
              (a) => thousandsFormat(a.points),
              (a) => nf.format(a.member_count),
              (a) => nf.format(a.village_count),
              (a) => thousandsFormat((a.member_count === 0)?(0):(a.points / a.member_count)),
              (a) => thousandsFormat(a.gesBash),
              (a) => thousandsFormat(a.offBash),
              (a) => thousandsFormat(a.defBash),
            ]}
            cellClasses={["", "", "", "text-end", "text-end", "", "text-end", "text-end", "text-end", "text-end"]}
            keyGen={a => a.allyID}
            serverSide
            defaultSort={["rank", SORTING_DIRECTION.ASC]}
            saveAs={'worldAlly'}
            responsiveTable
            searching
        />
      }
  />
};
