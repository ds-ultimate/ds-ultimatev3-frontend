import {useMemo} from "react"
import {playerBasicData, playerChartData} from "../apiConf"
import {useDataloaderCallback} from "../DataloaderCallback"
import {playerBasicDataType, playerChartDataType} from "../../modelHelper/Player"
import {useCachedData} from "../cacheInterface"


export function usePlayerData(server: string | undefined, world: string | undefined, player: string | undefined) {
  const [params, dbKey, cacheKey] =
      useMemo(() => {
        if(server === undefined || world === undefined || player === undefined) {
          return [undefined, undefined, ""]
        }
        return [
          {id: player, world, server},
          [player, world, server],
          "playerBasic" + server + "_" + world + "_" + player,
        ]
      }, [server, world, player])
  const downloadCB = useDataloaderCallback<playerBasicDataType>(params, cacheKey, playerBasicData)
  return useCachedData<playerBasicDataType>("playerBasic", "playerData", downloadCB, dbKey)
}

export function usePlayerChartData(server: string | undefined, world: string | undefined, player: string | undefined) {
  const [params, dbKey, cacheKey] =
      useMemo(() => {
        if(server === undefined || world === undefined || player === undefined) {
          return [undefined, undefined, ""]
        }
        return [
          {id: player, world, server},
          [player, world, server],
          "playerChart" + server + "_" + world + "_" + player,
        ]
      }, [server, world, player])
  const downloadCB = useDataloaderCallback<playerChartDataType>(params, cacheKey, playerChartData)
  return useCachedData<playerChartDataType>("playerChart", "playerChartData", downloadCB, dbKey)
}
