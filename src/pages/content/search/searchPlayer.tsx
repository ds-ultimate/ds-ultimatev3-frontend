import {WorldDisplayName, worldDisplayNameRaw, worldType} from "../../../modelHelper/World"
import {useTranslation} from "react-i18next"
import React, {useEffect, useMemo, useState} from "react"
import DatatableHeaderBuilder from "../../../util/datatables/DatatableHeaderBuilder"
import DatatableBase, {DATATABLE_VARIANT} from "../../../util/datatables/DatatableBase"
import {nf} from "../../../util/UtilFunctions"
import axios from "axios"
import {searchExtended, searchNormal} from "../../../apiInterface/apiConf"
import {Card} from "react-bootstrap"
import {SEARCH_LIMIT} from "../Search"
import {LinkPlayerTop, playerTopType} from "../../../modelHelper/Player"
import ErrorPage from "../../layout/ErrorPage"
import useTrackSearch from "../../../matomo/TrackSearch"


type playerSearchResult =  {
  world: worldType,
  player: playerTopType,
}

export function usePlayerSearchDatatableHeader() {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder<playerSearchResult>()
        .addMainRow(row => {
          row.addCell({title: t('table.world'),
            sortCB: ((data1, data2) => worldDisplayNameRaw(t, data1.world).localeCompare(worldDisplayNameRaw(t, data2.world)))})
          row.addCell({title: t('table.name'),
            sortCB: ((data1, data2) => data1.player.name.localeCompare(data2.player.name))})
          row.addCell({title: t('table.points'),
            sortCB: ((data1, data2) => data1.player.points_top - data2.player.points_top)})
          row.addCell({title: t('table.villages'),
            sortCB: ((data1, data2) => data1.player.village_count_top - data2.player.village_count_top)})
        })
  }, [t])
}


export function SearchPlayer({server, search, searchActive, searchWorlds}: {server: string, search: string, searchActive: boolean, searchWorlds: number[]}) {
  const header = usePlayerSearchDatatableHeader()
  const [data, updateData] = useState<playerSearchResult[]>([])
  const [dataErr, setDataErr]  = useState<any>(undefined)
  const { t } = useTranslation("ui")
  const trackSearch = useTrackSearch()

  useEffect(() => {
    if(searchActive) {
      axios.post(searchNormal({}),{type: "player", server: server, search: search} )
          .then((resp) => {
            updateData(resp.data)
            trackSearch(search, "player", resp.data.length)
            setDataErr(undefined)
          })
          .catch((reason) => {
            setDataErr(reason)
          })
    } else {
      if(searchWorlds.length <= 0) {
        updateData([])
        return
      }
      axios.post(searchExtended({}),{type: "player", search: search, worlds: searchWorlds} )
          .then((resp) => {
            updateData(resp.data)
            trackSearch(search, "player", resp.data.length)
            setDataErr(undefined)
          })
          .catch((reason) => {
            setDataErr(reason)
          })
    }
  }, [updateData, server, search, searchActive, searchWorlds, trackSearch])

  if(dataErr) return <ErrorPage error={dataErr} />

  return (
      <>
        <Card.Title>{t("title.searchResults")}: {data.length}</Card.Title>
        {data.length >= SEARCH_LIMIT && t("title.searchLimited", {limit: SEARCH_LIMIT})}
        <DatatableBase<playerSearchResult>
            data={data}
            header={header}
            variant={DATATABLE_VARIANT.DATA}
            saveAs={"searchAlly"}
            cells={[
              (p) => <WorldDisplayName world={p.world} />,
              (p) => <LinkPlayerTop world={p.world} player={p.player} />,
              (p) => nf.format(p.player.points_top),
              (p) => nf.format(p.player.village_count_top),
            ]}
            keyGen={p => p.world.name + "_" + p.player.playerID}
            searching={searchCBPlayerSearchRes}
        />
      </>
  )
}

export function searchCBPlayerSearchRes(p: playerSearchResult, search: string) {
  return p.player.name.includes(search)
}
