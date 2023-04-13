import axios, {AxiosResponse} from "axios";
import {indexPage, serverGetWorlds, worldOverview} from "./apiConf";
import {worldType} from "../modelHelper/World";
import {serverType} from "../modelHelper/Server";
import {newsType} from "../modelHelper/News";
import {Dict} from "../util/customTypes";
import {playerType} from "../modelHelper/Player";
import {allyType} from "../modelHelper/Ally";
import {useEffect, useState} from "react";

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
  listeners: Array<(data: T) => any> = []
  errorVal: T
  data: T | null = null
  constructor(url: string, error: T) {
    this.callback = this.callback.bind(this)
    this.callbackErr = this.callbackErr.bind(this)
    this.errorVal = error
    axios.get(url).then(this.callback).catch(this.callbackErr)
  }

  callback(response: AxiosResponse<any>) {
    this.data = response.data
    this.listeners.forEach(l => l(response.data))
  }

  callbackErr(_error: any) {
    this.data = this.errorVal
    this.listeners.forEach(l => l(this.errorVal))
  }

  getPromise() {
    return new Promise<T>((resolve) => {
      if (this.data == null) {
        this.listeners.push(resolve)
      } else {
        resolve(this.data)
      }
    })
  }
}

let worldsOfServerData: Dict<Dataloader<{server?: serverType, worlds: worldType[]}>> = {}
export const WORLDS_OF_SERVER_DEFAULT = {worlds: []}
export function getWorldsOfServer(server: string) {
  let loader = worldsOfServerData[server]
  if(loader !== undefined) {
    return loader.getPromise()
  }
  loader = new Dataloader<{server?: serverType, worlds: worldType[]}>(serverGetWorlds({server}), WORLDS_OF_SERVER_DEFAULT)
  worldsOfServerData[server] = loader
  return loader.getPromise()
}

let indexPageCache: Dataloader<{servers: serverType[], news: newsType[]}> | undefined = undefined
export const INDEX_PAGE_DEFAULT = {servers: [], news: []}
export function getIndexPageData(){
  if(indexPageCache !== undefined) {
    return indexPageCache.getPromise()
  }
  indexPageCache = new Dataloader<{servers: serverType[], news: newsType[]}>(indexPage({}), INDEX_PAGE_DEFAULT)
  return indexPageCache.getPromise()
}

export const WORLD_OVERVIEW_DEFAULT = {player: [], ally: []}
export function getWorldOverview(server: string, world: string) {
  const loader = new Dataloader<{player: playerType[], ally: allyType[], world?: worldType}>(worldOverview({server, world}), WORLD_OVERVIEW_DEFAULT)
  return loader.getPromise()
}

export function getWorldData(server: string, world: string) {
  return new Promise<worldType>((resolve) => {
    getWorldsOfServer(server)
        .then(({worlds}) => {
          const w = worlds.find(w => w.name === world)
          if(w) {
            resolve(w)
          }
        })
  })
}

export function useWorldData(server?: string, world?: string) {
  const [worldData, setWorldData] = useState<worldType>()

  useEffect(() => {
    let mounted = true
    if(server === undefined || world === undefined) {
      setWorldData(undefined)
    } else {
      getWorldData(server, world)
          .then(data => {
            if(mounted) {
              setWorldData(data)
            }
          })
    }
    return () => {
      mounted = false
    }
  }, [server, world])

  return worldData
}
