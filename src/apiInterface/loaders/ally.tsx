import {allyBasicDataType, allyChartDataType} from "../../modelHelper/Ally"
import {useMemo} from "react"
import {allyBasicData, allyChartData} from "../apiConf"
import {useDataloaderCallback} from "../DataloaderCallback"
import {useCachedData} from "../cacheInterface"


export function useAllyData(server: string | undefined, world: string | undefined, ally: string | undefined) {
  const [params, dbKey, cacheKey] =
      useMemo(() => {
        if(server === undefined || world === undefined || ally === undefined) {
          return [undefined, undefined, ""]
        }
        return [
          {id: ally, world, server},
          [ally, world, server],
          "allyBasic" + server + "_" + world + "_" + ally,
        ]
      }, [server, world, ally])
  const downloadCB = useDataloaderCallback<allyBasicDataType>(params, cacheKey, allyBasicData)
  return useCachedData<allyBasicDataType>("allyBasic", "allyData", downloadCB, dbKey)
}

export function useAllyChartData(server: string | undefined, world: string | undefined, ally: string | undefined) {
  const [params, dbKey, cacheKey] =
      useMemo(() => {
        if(server === undefined || world === undefined || ally === undefined) {
          return [undefined, undefined, ""]
        }
        return [
          {id: ally, world, server},
          [ally, world, server],
          "allyChart" + server + "_" + world + "_" + ally,
        ]
      }, [server, world, ally])
  const downloadCB = useDataloaderCallback<allyChartDataType>(params, cacheKey, allyChartData)
  return useCachedData<allyChartDataType>("allyChart", "allyChartData", downloadCB, dbKey)
}
