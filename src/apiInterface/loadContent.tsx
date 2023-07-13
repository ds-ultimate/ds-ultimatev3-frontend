import axios, {AxiosResponse} from "axios";
import {
  allyBasicData,
  allyChartData,
  changelogPage,
  indexPage,
  playerBasicData,
  playerChartData,
  serverGetWorlds, villageBasicData,
  worldGetExtendedData,
  worldOverview
} from "./apiConf";
import {worldExtendedType, worldType} from "../modelHelper/World";
import {serverType} from "../modelHelper/Server";
import {newsType} from "../modelHelper/News";
import {Dict} from "../util/customTypes";
import {playerBasicDataType, playerChartDataType, playerType} from "../modelHelper/Player";
import {allyBasicDataType, allyChartDataType, allyType} from "../modelHelper/Ally";
import {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {villageBasicDataType} from "../modelHelper/Village";
import {changelogType} from "../modelHelper/Changelog";
import {LoadingScreenContext} from "../pages/layout/LoadingScreen";

if(process.env.REACT_APP_API_USE_AUTH) {
  const auth = {
    username: process.env.REACT_APP_API_AUTH_USER,
    password: process.env.REACT_APP_API_AUTH_PASS,
  }
  axios.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(auth.username + ':' + auth.password)
}

/**
 * Class for caching return values of an API endpoint
 */
class Dataloader<T> {
  listeners: Array<{then: (data: T) => void, catch: (error: any) => void}> = []
  data: T | null = null
  error: any | null = null
  constructor(url: string) {
    this.callback = this.callback.bind(this)
    this.callbackErr = this.callbackErr.bind(this)
    axios.get(url).then(this.callback).catch(this.callbackErr)
  }

  callback(response: AxiosResponse<any>) {
    this.data = response.data
    this.listeners.forEach(l => l.then(response.data))
  }

  callbackErr(error: any) {
    this.error = error
    this.listeners.forEach(l => l.catch(error))
  }

  getPromise() {
    return new Promise<T>((resolve, reject) => {
      if (this.data == null) {
        if(this.error == null) {
          this.listeners.push({then: resolve, catch: reject})
        } else {
          reject(this.error)
        }
      } else {
        resolve(this.data)
      }
    })
  }
}

function usePromisedData<T, V>(promise: (params: V) => Promise<T>, promiseParams: V, loadId: string) : [any, T | undefined] {
  const [{error, data}, setData] = useState<{error: any, data: T | undefined}>({error: null, data: undefined})
  const setLoading = useContext(LoadingScreenContext)

  useEffect(() => {
    let mounted = true
    setLoading(true, loadId)
    promise(promiseParams)
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
  }, [promise, promiseParams, setLoading, loadId])

  return [error, data]
}

function useDefaultedPromisedData<T, V>(promise: (params: V) => Promise<T | undefined>, promiseParams: V, datDefault: T, loadId: string) : [any, T] {
  let [err, dat] = usePromisedData(promise, promiseParams, loadId)
  if(dat === undefined) dat = datDefault
  return [err, dat]
}

type worldsOfServerType = {server?: serverType, worlds: worldType[]}
let worldsOfServerData: Dict<Dataloader<worldsOfServerType>> = {}
export function getWorldsOfServer({server}: {server: string | undefined}): Promise<undefined | worldsOfServerType> {
  if(server === undefined) {
    return new Promise((resolve) => resolve(undefined))
  }
  let loader = worldsOfServerData[server]
  if(loader !== undefined) {
    return loader.getPromise()
  }
  loader = new Dataloader<worldsOfServerType>(serverGetWorlds({server}))
  worldsOfServerData[server] = loader
  return loader.getPromise()
}

const WORLDS_OF_SERVER_DEFAULT: worldsOfServerType = {worlds: []}
export function useWorldsOfServer(server: string | undefined) {
  const prom = useCallback((params: {server: string | undefined}) => getWorldsOfServer(params), [])
  const params = useMemo(() => ({server}), [server])
  return useDefaultedPromisedData(prom, params, WORLDS_OF_SERVER_DEFAULT, "worldPage")
}

type indexPageType = {servers: serverType[], news: newsType[]}
let indexPageCache: Dataloader<indexPageType> | undefined = undefined
export const INDEX_PAGE_DEFAULT: indexPageType = {servers: [], news: []}
export function useIndexPageData(){
  const prom = useCallback(() => {
    if(indexPageCache !== undefined) {
      return indexPageCache.getPromise()
    }
    indexPageCache = new Dataloader<indexPageType>(indexPage({}))
    return indexPageCache.getPromise()
  }, [])
  return useDefaultedPromisedData(prom, null, INDEX_PAGE_DEFAULT, "indexPage")
}

let changelogPageCache: Dataloader<Array<changelogType>> | undefined = undefined
export function useChangelogPageData(){
  const prom = useCallback(() => {
    if(changelogPageCache !== undefined) {
      return changelogPageCache.getPromise()
    }
    changelogPageCache = new Dataloader<Array<changelogType>>(changelogPage({}))
    return changelogPageCache.getPromise()
  }, [])
  return useDefaultedPromisedData(prom, null, [], "changelogPage")
}

type worldOverviewType = {player: playerType[], ally: allyType[], world?: worldType}
const WORLD_OVERVIEW_DEFAULT: worldOverviewType = {player: [], ally: []}
export function useWorldOverview(server: string | undefined, world: string | undefined) {
  const prom = useCallback(({server, world}: {server: string | undefined, world: string | undefined}) => {
    const loader = new Dataloader<worldOverviewType>(worldOverview({server, world}))
    return loader.getPromise()
  }, [])
  const params = useMemo(() => ({server, world}), [server, world])
  return useDefaultedPromisedData(prom, params, WORLD_OVERVIEW_DEFAULT, "worldOverviewPage")
}

export function useWorldData(server: string | undefined, world: string | undefined) {
  const prom = useCallback(({server, world}: {server: string | undefined, world: string | undefined}) => {
    return new Promise<worldType>((resolve, reject) => {
      getWorldsOfServer({server})
          .then(result => {
            if(result === undefined || world === undefined) {
              reject(undefined)
              return
            }
            const {worlds} = result

            const w = worlds.find(w => w.name === world)
            if(w) {
              resolve(w)
            } else {
              reject("world.not_found") //TODO good error handling (reject with user visible error)
            }
          })
          .catch(reason => {
            console.log("FIXME: Reason:", reason) //TODO good error handling (reject with user visible error)
            reject(reason)
          })
    })
  }, [])
  const params = useMemo(() => ({server, world}), [server, world])
  return usePromisedData(prom, params, "worldData")
}

let extendedWorldDataCache: Dict<Dataloader<worldExtendedType>> = {}
export function useExtendedWorldData(server: string | undefined, world: string | undefined) {
  const prom = useCallback(({server, world}: {server: string | undefined, world: string | undefined}): Promise<worldExtendedType> => {
    if(server === undefined || world === undefined) {
      return new Promise((resolve, reject) => reject(undefined))
    }
    let loader = extendedWorldDataCache[server + "_" + world]
    if(loader !== undefined) {
      return loader.getPromise()
    }
    loader = new Dataloader<worldExtendedType>(worldGetExtendedData({server, world}))
    extendedWorldDataCache[server + "_" + world] = loader
    return loader.getPromise()
  }, [])
  const params = useMemo(() => ({server, world}), [server, world])
  return usePromisedData(prom, params, "extendedWorldData")
}

let allyDataCache: Dict<Dataloader<allyBasicDataType>> = {}
export function useAllyData(server: string | undefined, world: string | undefined, ally: string | undefined) {
  const prom = useCallback(({server, world, ally}: {server: string | undefined, world: string | undefined, ally: string | undefined}): Promise<allyBasicDataType> => {
    if(server === undefined || world === undefined || ally === undefined) {
      return new Promise((resolve, reject) => reject(undefined))
    }
    let loader = allyDataCache[server + "_" + world + "_" + ally]
    if(loader !== undefined) {
      return loader.getPromise()
    }
    loader = new Dataloader<allyBasicDataType>(allyBasicData({server, world, ally}))
    allyDataCache[server + "_" + world + "_" + ally] = loader
    return loader.getPromise()
  }, [])
  const params = useMemo(() => ({server, world, ally}), [server, world, ally])
  return usePromisedData(prom, params, "allyData")
}

let allyChartDataCache: Dict<Dataloader<allyChartDataType>> = {}
export function useAllyChartData(server: string | undefined, world: string | undefined, ally: string | undefined) {
  const prom = useCallback(({server, world, ally}: {server: string | undefined, world: string | undefined, ally: string | undefined}): Promise<allyChartDataType> => {
    if(server === undefined || world === undefined || ally === undefined) {
      return new Promise((resolve, reject) => reject(undefined))
    }
    let loader = allyChartDataCache[server + "_" + world + "_" + ally]
    if(loader !== undefined) {
      return loader.getPromise()
    }
    loader = new Dataloader<allyChartDataType>(allyChartData({server, world, ally}))
    allyChartDataCache[server + "_" + world + "_" + ally] = loader
    return loader.getPromise()
  }, [])
  const params = useMemo(() => ({server, world, ally}), [server, world, ally])
  return usePromisedData(prom, params, "allyChartData")
}

let playerDataCache: Dict<Dataloader<playerBasicDataType>> = {}
export function usePlayerData(server: string | undefined, world: string | undefined, player: string | undefined) {
  const prom = useCallback(({server, world, player}: {server: string | undefined, world: string | undefined, player: string | undefined}): Promise<playerBasicDataType> => {
    if(server === undefined || world === undefined || player === undefined) {
      return new Promise((resolve, reject) => reject(undefined))
    }
    let loader = playerDataCache[server + "_" + world + "_" + player]
    if(loader !== undefined) {
      return loader.getPromise()
    }
    loader = new Dataloader<playerBasicDataType>(playerBasicData({server, world, player}))
    playerDataCache[server + "_" + world + "_" + player] = loader
    return loader.getPromise()
  }, [])
  const params = useMemo(() => ({server, world, player}), [server, world, player])
  return usePromisedData(prom, params, "playerData")
}

let playerChartDataCache: Dict<Dataloader<playerChartDataType>> = {}
export function usePlayerChartData(server: string | undefined, world: string | undefined, player: string | undefined) {
  const prom = useCallback(({server, world, player}: {server: string | undefined, world: string | undefined, player: string | undefined}): Promise<playerChartDataType> => {
    if(server === undefined || world === undefined || player === undefined) {
      return new Promise((resolve, reject) => reject(undefined))
    }
    let loader = playerChartDataCache[server + "_" + world + "_" + player]
    if(loader !== undefined) {
      return loader.getPromise()
    }
    loader = new Dataloader<playerChartDataType>(playerChartData({server, world, player}))
    playerChartDataCache[server + "_" + world + "_" + player] = loader
    return loader.getPromise()
  }, [])
  const params = useMemo(() => ({server, world, player}), [server, world, player])
  return usePromisedData(prom, params, "playerChartData")
}

let villageDataCache: Dict<Dataloader<villageBasicDataType>> = {}
export function useVillageData(server: string | undefined, world: string | undefined, village: string | undefined) {
  const prom = useCallback(({server, world, village}: {server: string | undefined, world: string | undefined, village: string | undefined}): Promise<villageBasicDataType> => {
    if(server === undefined || world === undefined || village === undefined) {
      return new Promise((resolve, reject) => reject(undefined))
    }
    let loader = villageDataCache[server + "_" + world + "_" + village]
    if(loader !== undefined) {
      return loader.getPromise()
    }
    loader = new Dataloader<villageBasicDataType>(villageBasicData({server, world, village}))
    villageDataCache[server + "_" + world + "_" + village] = loader
    return loader.getPromise()
  }, [])
  const params = useMemo(() => ({server, world, village}), [server, world, village])
  return usePromisedData(prom, params, "villageData")
}
