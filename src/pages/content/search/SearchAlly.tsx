import {WorldDisplayName, worldDisplayNameRaw, worldType} from "../../../modelHelper/World"
import {allyTopType, LinkAllyTop} from "../../../modelHelper/Ally"
import {useTranslation} from "react-i18next"
import React, {useEffect, useMemo, useState} from "react"
import DatatableHeaderBuilder from "../../../util/datatables/DatatableHeaderBuilder"
import DatatableBase, {DATATABLE_VARIANT} from "../../../util/datatables/DatatableBase"
import {nf} from "../../../util/UtilFunctions"
import axios from "axios"
import {searchExtended, searchNormal} from "../../../apiInterface/apiConf"
import {Card} from "react-bootstrap"
import {SEARCH_LIMIT} from "../SearchPage"
import ErrorPage from "../../layout/ErrorPage"
import useTrackSearch from "../../../matomo/TrackSearch"


type allySearchResult = {
  world: worldType,
  ally: allyTopType,
}

export function useAllySearchDatatableHeader() {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder<allySearchResult>()
        .addMainRow(row => {
          row.addCell({title: t('table.world'),
            sortCB: ((data1, data2) => worldDisplayNameRaw(t, data1.world).localeCompare(worldDisplayNameRaw(t, data2.world)))})
          row.addCell({title: t('table.name'), showAt: "md",
            sortCB: ((data1, data2) => data1.ally.name.localeCompare(data2.ally.name))})
          row.addCell({title: t('table.tag'),
            sortCB: ((data1, data2) => data1.ally.tag.localeCompare(data2.ally.tag))})
          row.addCell({title: t('table.points'),
            sortCB: ((data1, data2) => data1.ally.points_top - data2.ally.points_top)})
          row.addCell({title: t('table.villages'),
            sortCB: ((data1, data2) => data1.ally.village_count_top - data2.ally.village_count_top)})
        })
  }, [t])
}


export function SearchAlly({server, search, searchActive, searchWorlds}: {server: string, search: string, searchActive: boolean, searchWorlds: number[]}) {
  const header = useAllySearchDatatableHeader()
  const [data, updateData] = useState<allySearchResult[]>([])
  const [dataErr, setDataErr]  = useState<any>(undefined)
  const { t } = useTranslation("ui")
  const trackSearch = useTrackSearch()

  useEffect(() => {
    if(searchActive) {
      axios.post(searchNormal({}),{type: "ally", server: server, search: search} )
          .then((resp) => {
            updateData(resp.data)
            setDataErr(undefined)
            trackSearch(search, "ally", resp.data.length)
          })
          .catch((reason) => {
            setDataErr(reason)
          })
    } else {
      if(searchWorlds.length <= 0) {
        updateData([])
        return
      }
      axios.post(searchExtended({}),{type: "ally", search: search, worlds: searchWorlds} )
          .then((resp) => {
            updateData(resp.data)
            trackSearch(search, "ally", resp.data.length)
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
        <DatatableBase<allySearchResult>
            data={data}
            header={header}
            variant={DATATABLE_VARIANT.DATA}
            saveAs={"searchAlly"}
            cells={[
              (a) => <WorldDisplayName world={a.world} />,
              (a) => <LinkAllyTop world={a.world} ally={a.ally} />,
              (a) => <LinkAllyTop world={a.world} ally={a.ally} useTag />,
              (a) => nf.format(a.ally.points_top),
              (a) => nf.format(a.ally.village_count_top),
            ]}
            keyGen={a => a.world.name + "_" + a.ally.allyID}
            searching={searchCBAllySearchRes}
          />
      </>
  )
}

export function searchCBAllySearchRes(a: allySearchResult, search: string) {
  return a.ally.name.includes(search) || a.ally.tag.includes(search)
}
