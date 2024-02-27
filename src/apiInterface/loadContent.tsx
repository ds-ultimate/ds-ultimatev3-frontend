import {worldOverview} from "./apiConf";
import {playerType} from "../modelHelper/Player";
import {allyType} from "../modelHelper/Ally";
import {useCallback, useContext, useEffect, useState} from "react";
import {LoadingScreenContext} from "../pages/layout/LoadingScreen";
import {Dataloader} from "./dataloader"


export function usePromisedData<T>(promise: () => Promise<T>, loadId: string) : [any, T | undefined] {
  const [{error, data}, setData] = useState<{error: any, data: T | undefined}>({error: null, data: undefined})
  const setLoading = useContext(LoadingScreenContext)

  useEffect(() => {
    let mounted = true
    setLoading(true, loadId)
    promise()
        .then(data => {
          setLoading(false, loadId)
          if(mounted) {
            setData({data, error: null})
          }
        })
        .catch(reason => {
          setLoading(false, loadId)
          setData({data: undefined, error: reason})
        })
    return () => {
      mounted = false
    }
  }, [promise, setLoading, loadId])

  return [error, data]
}

function useDefaultedPromisedData<T>(promise: () => Promise<T | undefined>, datDefault: T, loadId: string) : [any, T] {
  let [err, dat] = usePromisedData(promise, loadId)
  if(dat === undefined) dat = datDefault
  return [err, dat]
}

type worldOverviewType = {player: playerType[], ally: allyType[]}
const WORLD_OVERVIEW_DEFAULT: worldOverviewType = {player: [], ally: []}
const worldOverviewCache: Map<string, Dataloader<worldOverviewType>> =  new Map()
export function useWorldOverview(server: string | undefined, world: string | undefined) {
  const prom = useCallback(() => {
    if(server === undefined || world === undefined) {
      return new Promise<worldOverviewType>((resolve, reject) => reject(undefined))
    }

    let loader = worldOverviewCache.get(server + "_" + world)
    if(loader !== undefined) {
      return loader.getPromise()
    }

    loader = new Dataloader<worldOverviewType>(worldOverview({server, world}), {})
    worldOverviewCache.set(server + "_" + world, loader)
    return loader.getPromise()
  }, [server, world])
  return useDefaultedPromisedData(prom, WORLD_OVERVIEW_DEFAULT, "worldOverviewPage")
}
