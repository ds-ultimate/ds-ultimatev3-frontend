import {useParams} from "react-router-dom";
import DatatableBase, {SORTING_DIRECTION} from "../../util/datatables/DatatableBase";
import {useTranslation} from "react-i18next";
import {WorldDisplayName} from "../../modelHelper/World";
import {useWorldData} from "../../apiInterface/loadContent";
import {LinkPlayer, LinkPlayerAlly, playerType} from "../../modelHelper/Player";
import {nf} from "../../util/UtilFunctions";
import {worldPlayerCurrentTable} from "../../apiInterface/apiConf";
import {TFunction} from "i18next";
import DatatableHeaderBuilder from "../../util/datatables/DatatableHeaderBuilder";
import StatsPage from "../layout/StatsPage";

const PlayerDatatableHeader = (t: TFunction<"ui", undefined, "ui">) => {
  return new DatatableHeaderBuilder()
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
}

export default function WorldPlayerCurrentPage() {
  const {server, world} = useParams()
  const worldData = useWorldData(server, world)
  const { t } = useTranslation("ui")

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
            header={PlayerDatatableHeader(t)}
            cells={[
              (p) => nf.format(p.rank),
              (p) => <>{worldData && <LinkPlayer player={p} world={worldData} />}</>,
              (p) => <>{worldData && <LinkPlayerAlly player={p} world={worldData} />}</>,
              (p) => nf.format(p.points),
              (p) => nf.format(p.village_count),
              (p) => nf.format((p.village_count === 0)?(0):(p.points / p.village_count)),
              (p) => nf.format(p.gesBash),
              (p) => nf.format(p.offBash),
              (p) => nf.format(p.defBash),
              (p) => nf.format(p.supBash),
            ]}
            keyGen={p => p.playerID}
            serverSide
            defaultSort={["rank", SORTING_DIRECTION.ASC]}
            saveAs={'worldPlayer'}
            responsiveTable
        />
      }
  />
};

export {PlayerDatatableHeader}
