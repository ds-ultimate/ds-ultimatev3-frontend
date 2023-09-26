import {villageBasicDataType} from "../../modelHelper/Village"
import {useMemo} from "react"
import { villageBasicData} from "../apiConf"
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
