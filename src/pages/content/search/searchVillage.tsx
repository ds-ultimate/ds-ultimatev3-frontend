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
import ErrorPage from "../../layout/ErrorPage"
import {
  LinkVillage,
  VillageBonusText,
  villageContinent,
  villageCoordinates,
  villagePureType
} from "../../../modelHelper/Village"
import useTrackSearch from "../../../matomo/TrackSearch"


type villageSearchResult = {
  world: worldType,
  village: villagePureType,
}

export function useVillageSearchDatatableHeader() {
  const {t} = useTranslation("ui")
  return useMemo(() => {
    return new DatatableHeaderBuilder<villageSearchResult>()
        .addMainRow(row => {
          row.addCell({title: t('table.world'),
            sortCB: ((data1, data2) => worldDisplayNameRaw(t, data1.world).localeCompare(worldDisplayNameRaw(t, data2.world)))})
          row.addCell({title: t('table.name'),
            sortCB: ((data1, data2) => data1.village.name.localeCompare(data2.village.name))})
          row.addCell({title: t('table.points'),
            sortCB: ((data1, data2) => data1.village.points - data2.village.points)})
          row.addCell({title: t('table.continent'), showAt: "md",
            sortCB: ((data1, data2) => villageContinent(data1.village) - villageContinent(data2.village))})
          row.addCell({title: t('table.coordinates'),
            sortCB: ((data1, data2) => villageCoordinates(data1.village).localeCompare(villageCoordinates(data2.village)))})
          row.addCell({title: t('table.bonusType'), showAt: "lg",
            sortCB: ((data1, data2) => data1.village.bonus_id - data2.village.bonus_id)})
        })
  }, [t])
}


export function SearchVillage({server, search, searchActive, searchWorlds}: {server: string, search: string, searchActive: boolean, searchWorlds: number[]}) {
  const header = useVillageSearchDatatableHeader()
  const [data, updateData] = useState<villageSearchResult[]>([])
  const [dataErr, setDataErr]  = useState<any>(undefined)
  const { t } = useTranslation("ui")
  const trackSearch = useTrackSearch()

  useEffect(() => {
    if(searchActive) {
      axios.post(searchNormal({}),{type: "village", server: server, search: search} )
          .then((resp) => {
            updateData(resp.data)
            trackSearch(search, "village", resp.data.length)
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
      axios.post(searchExtended({}),{type: "village", search: search, worlds: searchWorlds} )
          .then((resp) => {
            updateData(resp.data)
            trackSearch(search, "village", resp.data.length)
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
        <DatatableBase<villageSearchResult>
            data={data}
            header={header}
            variant={DATATABLE_VARIANT.DATA}
            saveAs={"searchAlly"}
            cells={[
              (v) => <WorldDisplayName world={v.world} />,
              (v) => <LinkVillage world={v.world} village={v.village} />,
              (v) => nf.format(v.village.points),
              (v) => <>{villageContinent(v.village)}</>,
              (v) => <>{villageCoordinates(v.village)}</>,
              (v) => <VillageBonusText vil={v.village} />,
            ]}
            keyGen={p => p.world.name + "_" + p.village.villageID}
            searching={searchCBVillageSearchRes}
        />
      </>
  )
}

export function searchCBVillageSearchRes(v: villageSearchResult, search: string) {
  return v.village.name.includes(search) || villageCoordinates(v.village).includes(search)
}
