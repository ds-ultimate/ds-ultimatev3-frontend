import {cachedVillageType, villageBasicDataType} from "../../modelHelper/Village"
import {useMemo} from "react"
import {villageAllyDataXY, villageBasicData} from "../apiConf"
import {useDataloaderCallback} from "../DataloaderCallback"
import {useCachedData} from "../cacheInterface"

export function useVillageData(server: string | undefined, world: string | undefined, village: string | undefined) {
  const [params, dbKey, cacheKey] =
      useMemo(() => {
        if(server === undefined || world === undefined || village === undefined) {
          return [undefined, undefined, ""]
        }
        return [
          {id: village, world, server},
          [village, world, server],
          "villageBasic" + server + "_" + world + "_" + village,
        ]
      }, [server, world, village])
  const downloadCB = useDataloaderCallback<villageBasicDataType>(params, cacheKey, villageBasicData)
  return useCachedData<villageBasicDataType>("villageBasic", "villageData", downloadCB, dbKey)
}

export function useVillageDataAllyXY(server: string | undefined, world: string | undefined, x: string | undefined, y: string | undefined) {
  const [params, routeP, dbKey, cacheKey] =
      useMemo(() => {
        if(server === undefined || world === undefined || x === undefined || y === undefined) {
          return [undefined, undefined, undefined, ""]
        }
        return [
          {world, server},
          {x, y},
          [x, y, world, server],
          "villageAllyCached" + server + "_" + world + "_" + x + "_" + y,
        ]
      }, [server, world, x, y])
  const downloadCB = useDataloaderCallback<cachedVillageType>(params, cacheKey, villageAllyDataXY, routeP)
  return useCachedData<cachedVillageType>("villageAllyCached", "villageAllyCached", downloadCB,
      dbKey, "x, y, world, server")
}

