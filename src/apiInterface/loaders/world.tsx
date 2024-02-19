import {WorldActiveMode, worldExtendedType, worldType} from "../../modelHelper/World"
import {getWorlds, worldGetExtendedData} from "../apiConf"
import {useCallback, useMemo} from "react"
import {FrontendError} from "../../pages/layout/ErrorPages/ErrorTypes"
import {useArrayDataloaderCallback, useDataloaderCallback} from "../DataloaderCallback"
import {useArrayCachedData, useCachedData, useOneOfArrayCachedData} from "../cacheInterface"


export function useActiveWorldsOfServer(server: string | undefined) {
  const dbKey =
      useMemo(() => {
        if(server === undefined) {
          return undefined
        }
        return IDBKeyRange.only([server, WorldActiveMode.ACTIVE])
      }, [server])
  const apiParams = useMemo(() => ({}), [])
  const downloadCB = useArrayDataloaderCallback<worldType>(apiParams, "getWorlds", getWorlds)
  const filterCB = useCallback(
      (w: worldType) => w.server__code === server && w.active === WorldActiveMode.ACTIVE, [server])
  return useArrayCachedData<worldType>(
      "world", "worldDataActive", downloadCB, filterCB, dbKey, "server__code, active")
}

export function useWorldsOfServer(server: string | undefined) {
  const dbKey =
      useMemo(() => {
        if(server === undefined) {
          return undefined
        }
        return IDBKeyRange.only(server)
      }, [server])
  const apiParams = useMemo(() => ({}), [])
  const downloadCB = useArrayDataloaderCallback<worldType>(apiParams, "getWorlds", getWorlds)
  const filterCB = useCallback((w: worldType) => w.server__code === server, [server])
  return useArrayCachedData<worldType>(
      "world", "worldDataServer", downloadCB, filterCB, dbKey, "server__code")
}

export function useWorldData(server: string | undefined, world: string | undefined) {
  const dbKey =
      useMemo(() => {
        if(server === undefined || world === undefined) {
          return undefined
        }
        return [world, server]
      }, [server, world])
  const apiParams = useMemo(() => ({}), [])
  const downloadCB = useArrayDataloaderCallback<worldType>(apiParams, "getWorlds", getWorlds)
  const findCB = useCallback(
      (w: worldType) => w.server__code === server && w.name === world,
      [server, world])
  const error: FrontendError = useMemo(() => ({
    isFrontend: true,
    code: 404,
    k: "404.noWorld",
    p: {world: (server ?? "") + world}
  }), [server, world])
  return useOneOfArrayCachedData<worldType>(
      "world", "worldData", downloadCB, findCB, error, dbKey, "world, server")
}

export function useWorldDataById(world_id: number) {
  const dbKey = world_id
  const apiParams = useMemo(() => ({}), [])
  const downloadCB = useArrayDataloaderCallback<worldType>(apiParams, "getWorlds", getWorlds)
  const findCB = useCallback(
      (w: worldType) => w.id === world_id,
      [world_id])
  const error: FrontendError = useMemo(() => ({
    isFrontend: true,
    code: 404,
    k: "404.noWorldId",
    p: {id: ""+world_id}
  }), [world_id])
  return useOneOfArrayCachedData<worldType>(
      "world", "worldData", downloadCB, findCB, error, dbKey)
}

export function useExtendedWorldData(server: string | undefined, world: string | undefined) {
  const [params, dbKey, cacheKey] =
      useMemo(() => {
        if(server === undefined || world === undefined) {
          return [undefined, undefined, ""]
        }
        return [
          {world, server},
          [world, server],
          "worldExtended" + server + "_" + world,
        ]
      }, [server, world])
  const downloadCB = useDataloaderCallback<worldExtendedType>(params, cacheKey, worldGetExtendedData)
  return useCachedData<worldExtendedType>("worldExtended", "extendedWorldData", downloadCB, dbKey)
}
