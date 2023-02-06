import axios, {AxiosResponse} from "axios";
import {serverGetWorlds, indexPage} from "./apiConf";
import {worldType} from "../modelHelper/World";
import {serverType} from "../modelHelper/Server";
import {newsType} from "../modelHelper/News";
import {Dict} from "../util/customTypes";

const auth = {
  username: <censored>,
  password: <censored>,
}
axios.defaults.headers.common['Authorization'] = 'Basic ' + window.btoa(auth.username + ':' + auth.password)

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

let worldsOfServerData: Dict<Dataloader<worldType[]>> = {}
const getWorldsOfServer = (server: string) => {
  let loader = worldsOfServerData[server]
  if(loader !== undefined) {
    return loader.getPromise()
  }
  loader = new Dataloader<worldType[]>(serverGetWorlds({server}), [])
  worldsOfServerData[server] = loader
  return loader.getPromise()
}

let indexPageCache: Dataloader<{servers: serverType[], news: newsType[]}> | undefined = undefined
const getIndexPageData = () => {
  if(indexPageCache !== undefined) {
    return indexPageCache.getPromise()
  }
  indexPageCache = new Dataloader<{servers: serverType[], news: newsType[]}>(indexPage({}), {servers: [], news: []})
  return indexPageCache.getPromise()
}

export {getWorldsOfServer, getIndexPageData}
