import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {WorldDisplayName, worldType} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import {getWorldData} from "../../apiInterface/loadContent";
import DatatableBase, {SORTING_DIRECTION} from "../../util/datatables/DatatableBase";
import {worldAllyCurrentTable} from "../../apiInterface/apiConf";
import {nf} from "../../util/UtilFunctions";
import {allyType, LinkAlly} from "../../modelHelper/Ally";
import {TFunction} from "i18next";
import DatatableHeaderBuilder from "../../util/datatables/DatatableHeaderBuilder";

const AllyDatatableHeader = (t: TFunction<"ui", undefined, "ui">) => {
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
}

export default function WorldAllyCurrentPage() {
  const {server, world} = useParams()
  const [dataWorld, setDataWorld] = useState<worldType>()
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
        <h2>{t("table-title.overview")} {t("table-title.ally")}</h2>
        <DatatableBase<allyType>
            api={worldAllyCurrentTable({server, world})}
            header={AllyDatatableHeader(t)}
            cells={[
              (a) => nf.format(a.rank),
              (a) => <>{dataWorld && <LinkAlly ally={a} world={dataWorld} />}</>,
              (a) => <>{dataWorld && <LinkAlly ally={a} world={dataWorld} useTag />}</>,
              (a) => nf.format(a.points),
              (a) => nf.format(a.member_count),
              (a) => nf.format(a.village_count),
              (a) => nf.format((a.member_count === 0)?(0):(a.points / a.member_count)),
              (a) => nf.format(a.gesBash),
              (a) => nf.format(a.offBash),
              (a) => nf.format(a.defBash),
            ]}
            keyGen={a => a.allyID}
            serverSide
            defaultSort={["rank", SORTING_DIRECTION.ASC]}
            saveAs={'worldAlly'}
        />
      </>
  )
};

export {AllyDatatableHeader}
