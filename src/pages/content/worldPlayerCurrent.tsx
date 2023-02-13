import {useParams} from "react-router-dom";
import DatatableBase from "../../util/datatables/DatatableBase";
import {useTranslation} from "react-i18next";
import {WorldDisplayName, worldType} from "../../modelHelper/World";
import {useEffect, useState} from "react";
import {getWorldData} from "../../apiInterface/loadContent";
import {LinkPlayer, LinkPlayerAlly, playerType} from "../../modelHelper/Player";
import {FormatNumber} from "../../util/UtilFunctions";
import {worldPlayerCurrentTable} from "../../apiInterface/apiConf";
import DatatableHeader from "../../util/datatables/DatatableHeader";

export default function WorldPlayerCurrentPage() {
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
        <h2>{t("table-title.overview")} {t("table-title.player")}</h2>
        Server: {server}<br />
        World: {world}<br />
        <DatatableBase<playerType> api={worldPlayerCurrentTable({server, world})} header={
          <thead>
          <tr>
            <th colSpan={6}>{t('table-title.general')}</th>
            <th colSpan={4}>{t('table-title.bashStats')}</th>
          </tr>
          <tr>
            <DatatableHeader sortBy={"rank"}>{t('table.rank')}</DatatableHeader>
            <DatatableHeader sortBy={"name"}>{t('table.name')}</DatatableHeader>
            <DatatableHeader sortBy={"allyLatest__name"}>{t('table.ally')}</DatatableHeader>
            <DatatableHeader sortBy={"points"} sortDescDefault>{t('table.points')}</DatatableHeader>
            <DatatableHeader sortBy={"village_count"} sortDescDefault>{t('table.villages')}</DatatableHeader>
            <DatatableHeader>{t('table.avgVillage')}</DatatableHeader>
            <DatatableHeader sortBy={"gesBash"} sortDescDefault>{t('table.bashGes')}</DatatableHeader>
            <DatatableHeader sortBy={"offBash"} sortDescDefault>{t('table.bashOff')}</DatatableHeader>
            <DatatableHeader sortBy={"defBash"} sortDescDefault>{t('table.bashDef')}</DatatableHeader>
            <DatatableHeader sortBy={"supBash"} sortDescDefault>{t('table.bashSup')}</DatatableHeader>
          </tr>
          </thead>
        } cells={[
          (p) => <FormatNumber n={p.rank} />,
          (p) => <>{dataWorld && <LinkPlayer player={p} world={dataWorld} />}</>,
          (p) => <>{dataWorld && <LinkPlayerAlly player={p} world={dataWorld} />}</>,
          (p) => <FormatNumber n={p.points} />,
          (p) => <FormatNumber n={p.village_count} />,
          (p) => <FormatNumber n={(p.village_count === 0)?(0):(p.points / p.village_count)} />,
          (p) => <FormatNumber n={p.gesBash} />,
          (p) => <FormatNumber n={p.offBash} />,
          (p) => <FormatNumber n={p.defBash} />,
          (p) => <FormatNumber n={p.supBash} />,
        ]} keyGen={p => p.playerID} serverSide />
      </>
  )
};
