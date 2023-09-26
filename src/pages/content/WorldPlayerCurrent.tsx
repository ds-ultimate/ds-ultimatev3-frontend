import {useParams} from "react-router-dom";
import DatatableBase, {DATATABLE_VARIANT, SORTING_DIRECTION} from "../../util/datatables/DatatableBase";
import {useTranslation} from "react-i18next";
import {WorldDisplayName} from "../../modelHelper/World";
import {useWorldData} from "../../apiInterface/loaders/world"
import {LinkPlayer, LinkPlayerAlly, playerPureType, playerType} from "../../modelHelper/Player";
import {nf, thousandsFormat} from "../../util/UtilFunctions";
import {worldPlayerCurrentTable} from "../../apiInterface/apiConf";
import DatatableHeaderBuilder from "../../util/datatables/DatatableHeaderBuilder";
import StatsPage from "../layout/StatsPage";
import ErrorPage from "../layout/ErrorPage";
import React, {useMemo} from "react";

export function usePlayerDatatableHeader() {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder<playerType | [playerType, playerPureType | null]>()
        .addRow(row => {
          row.addCell({colSpan: 6, useConcat: false, title: t('table-title.general')})
          row.addCell({colSpan: 4, title: t('table-title.bashStats')})
        })
        .addMainRow(row => {
          row.addCell({sortBy: "rank", title: t('table.rank')})
          row.addCell({sortBy: "name", title: t('table.name')})
          row.addCell({sortBy: "allyLatest__name", title: t('table.ally')})
          row.addCell({sortBy: "points", sortDescDefault: true, title: t('table.points')})
          row.addCell({sortBy: "village_count", sortDescDefault: true, title: t('table.villages')})
          row.addCell({showAt: "md", title: t('table.avgVillage')})
          row.addCell({showAt: "lg", sortBy: "gesBash", sortDescDefault: true, title: t('table.bashGes')})
          row.addCell({showAt: "lg", sortBy: "offBash", sortDescDefault: true, title: t('table.bashOff')})
          row.addCell({showAt: "lg", sortBy: "defBash", sortDescDefault: true, title: t('table.bashDef')})
          row.addCell({showAt: "lg", sortBy: "supBash", sortDescDefault: true, title: t('table.bashSup')})
        })
  }, [t])
}

export default function WorldPlayerCurrentPage() {
  const {server, world} = useParams()
  const [worldErr, worldData] = useWorldData(server, world)
  const {t} = useTranslation("ui")
  const playerHeader = usePlayerDatatableHeader()

  if(worldErr) return <ErrorPage error={worldErr} />

  return <StatsPage
      title={
        <>
          {worldData && <WorldDisplayName world={worldData} />}<br />
          {t("table-title.overview")} {t("table-title.player")}
        </>
      }
      table={
        <DatatableBase<playerType>
            api={worldPlayerCurrentTable({server, world})}
            header={playerHeader}
            cells={[
              (p) => nf.format(p.rank),
              (p) => <>{worldData && <LinkPlayer player={p} world={worldData} />}</>,
              (p) => <>{worldData && <LinkPlayerAlly player={p} world={worldData} />}</>,
              (p) => thousandsFormat(p.points),
              (p) => nf.format(p.village_count),
              (p) => nf.format((p.village_count === 0)?(0):(p.points / p.village_count)),
              (p) => thousandsFormat(p.gesBash),
              (p) => thousandsFormat(p.offBash),
              (p) => thousandsFormat(p.defBash),
              (p) => thousandsFormat(p.supBash),
            ]}
            cellClasses={["", "", "", "text-end", "text-end", "", "text-end", "text-end", "text-end", "text-end"]}
            keyGen={p => p.playerID}
            variant={DATATABLE_VARIANT.SERVER_SIDE}
            defaultSort={["rank", SORTING_DIRECTION.ASC]}
            saveAs={'worldPlayer'}
            responsiveTable
            searching
        />
      }
  />
};

