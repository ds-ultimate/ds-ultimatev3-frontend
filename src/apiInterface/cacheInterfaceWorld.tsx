import {useCallback} from "react"
import {getCacheDuration} from "./cacheConf"
import {usePromisedData} from "./loadContent"
import {cacheable} from "./AbstractDatabase"
import {getWorldDatabase} from "./WorldDataDB"
import {worldType} from "../modelHelper/World"
import {getMainDatabase} from "./MainDatabase"


type worldCacheInfo = cacheable & {
  world_id: number
}

class PromiseDistributer<T> {
  listeners: Array<{then: (data: T) => void, catch: (error: any) => void}> = []
  data: T | null = null
  error: any | null = null
  constructor(prom: Promise<T>) {
    this.callback = this.callback.bind(this)
    this.callbackErr = this.callbackErr.bind(this)
    prom.then(this.callback).catch(this.callbackErr)
  }

  callback(data: T) {
    this.data = data
    this.listeners.forEach(l => l.then(data))
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

export function useOneOfArrayCachedWorldData<T>(
    world: worldType, tblName: string, loadId: string,
    loadExternalCB: () => Promise<T[]>,
    key?: IDBValidKey | IDBKeyRange, index?: string | undefined) {
  const prom = useCallback(() =>
          getOneOfArrayCachedWorldData(world, tblName, loadExternalCB, key, index)
      , [world, tblName, loadExternalCB, key, index])
  return usePromisedData(prom, loadId)
}

export function getOneOfArrayCachedWorldData<T>(
    world: worldType, tblName: string,
    loadExternalCB: () => Promise<T[]>,
    key?: IDBValidKey | IDBKeyRange, index?: string | undefined) {
  if(key === undefined) {
    return new Promise<T | undefined>((_, reject) => reject(undefined))
  }
  const db = getWorldDatabase(world)
  return new Promise<T | undefined>(async (resolve, reject) => {
    await ensureCacheValid(world, tblName, loadExternalCB)
    db.read<T>(tblName, key, index)
        .then(value => resolve(value))
        .catch(reason => reject(reason))
  })
}

export function useArrayCachedWorldData<T>(
    world: worldType, tblName: string, loadId: string,
    loadExternalCB: () => Promise<Array<T>>,
    key?: IDBKeyRange | null, index?: string | undefined) {
  const db = getWorldDatabase(world)
  const prom = useCallback(() => {
    if(key === undefined) {
      return new Promise<Array<T>>((resolve, reject) => reject(undefined))
    }
    return new Promise<Array<T>>(async (resolve, reject) => {
      await ensureCacheValid(world, tblName, loadExternalCB)
      db.readAll<T>(tblName, key===null?undefined:key, index)
          .then(value => resolve(value))
          .catch(reason => reject(reason))
    })
  }, [db, world, tblName, key, index, loadExternalCB])
  return usePromisedData(prom, loadId)
}


const externalLoaderCache: Map<string, {age: number, prom: PromiseDistributer<boolean>}> = new Map()

export async function ensureCacheValid<T>(world: worldType, tblName: string, loadExternalCB: () => Promise<T[]>) {
  const curTime = (new Date()).getTime()
  const mainDB = getMainDatabase()
  let externalLoader = externalLoaderCache.get(world.server__code + "_" + world.name + "_" + tblName)
  if(externalLoader !== undefined && curTime - externalLoader.age < 60) {
    return externalLoader.prom.getPromise()
  }

  const promise = mainDB.read<worldCacheInfo>("worldCacheInfo", [world.id, tblName])
  .then(async cacheInfo => {
    if(cacheInfo === undefined || curTime > cacheInfo.cached_at + getCacheDuration("worldData")) {
      //invalid
      const db = getWorldDatabase(world)
      await loadExternalCB()
          .then(value1 => {
            db.clearStore(tblName)
            db.writeAll(tblName, value1)
            updateCacheAge(world, tblName)
          })
    }
    return true
  })

  externalLoader = {
    age: curTime,
    prom: new PromiseDistributer<boolean>(promise)
  }
  externalLoaderCache.set(world.server__code + "_" + world.name + "_" + tblName, externalLoader)
  return externalLoader.prom.getPromise()

}

async function updateCacheAge(world: worldType, tblName: string) {
  const mainDB = getMainDatabase()
  const curTime = (new Date()).getTime()
  mainDB.write("worldCacheInfo", {world_id: world.id, type: tblName, cached_at: curTime})
}
