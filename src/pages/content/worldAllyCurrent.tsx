import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {WorldDisplayName, worldType} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import {getWorldData} from "../../apiInterface/loadContent";
import DatatableBase, {SORTING_DIRECTION} from "../../util/datatables/DatatableBase";
import {worldAllyCurrentTable} from "../../apiInterface/apiConf";
import DatatableHeader from "../../util/datatables/DatatableHeader";
import {nf} from "../../util/UtilFunctions";
import {allyType, LinkAlly} from "../../modelHelper/Ally";

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
        <DatatableBase<allyType> api={worldAllyCurrentTable({server, world})} header={
          <thead>
          <tr>
            <th colSpan={7}>{t('table-title.general')}</th>
            <th colSpan={3}>{t('table-title.bashStats')}</th>
          </tr>
          <tr>
            <DatatableHeader sortBy={"rank"}>{t('table.rank')}</DatatableHeader>
            <DatatableHeader sortBy={"name"}>{t('table.name')}</DatatableHeader>
            <DatatableHeader sortBy={"tag"}>{t('table.tag')}</DatatableHeader>
            <DatatableHeader sortBy={"points"} sortDescDefault>{t('table.points')}</DatatableHeader>
            <DatatableHeader sortBy={"member_count"} sortDescDefault>{t('table.members')}</DatatableHeader>
            <DatatableHeader sortBy={"village_count"} sortDescDefault>{t('table.villages')}</DatatableHeader>
            <DatatableHeader>{t('table.avgPlayer')}</DatatableHeader>
            <DatatableHeader sortBy={"gesBash"} sortDescDefault>{t('table.bashGes')}</DatatableHeader>
            <DatatableHeader sortBy={"offBash"} sortDescDefault>{t('table.bashOff')}</DatatableHeader>
            <DatatableHeader sortBy={"defBash"} sortDescDefault>{t('table.bashDef')}</DatatableHeader>
          </tr>
          </thead>
        } cells={[
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
        ]} keyGen={a => a.allyID} serverSide defaultSort={["rank", SORTING_DIRECTION.ASC]} saveAs={'worldAlly'} />
      </>
  )
};
