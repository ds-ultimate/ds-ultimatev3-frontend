import {useCallback} from "react"
import {getCacheDuration} from "./cacheConf"
import {usePromisedData} from "./loadContent"
import {cacheable, getMainDatabase} from "./MainDatabase"
import {FrontendError} from "../pages/layout/ErrorPages/ErrorTypes"


export function useCachedData<T extends cacheable>(
    tblName: string, loadId: string, loadExternalCB: () => Promise<T>,
    key: IDBValidKey | IDBKeyRange | undefined) {
  const db = getMainDatabase()
  const prom = useCallback(() => {
    if(key === undefined) {
      return new Promise<T>((_, reject) => reject(undefined))
    }
    return new Promise<T>((resolve, reject) => {
      db.read<T>(tblName, key)
          .then(value => {
            const curTime = (new Date()).getTime()
            if(value !== undefined) {
              if(curTime < value.cached_at + getCacheDuration(tblName)) {
                resolve(value)
                return
              }
            }
            loadExternalCB()
                .then(value1 => {
                  const writeVal = {...value1, cached_at: curTime}
                  db.write(tblName, writeVal)
                  resolve(writeVal)
                }).catch(reason => reject(reason))
          })
          .catch(reason => reject(reason))
    })
  }, [db, tblName, key, loadExternalCB])
  return usePromisedData(prom, loadId)
}

export function useOneOfArrayCachedData<T extends cacheable>(
    tblName: string, loadId: string,
    loadExternalCB: () => Promise<T[]>, findExternalCB: (val: T) => boolean,
    err404Data: FrontendError,
    key?: IDBValidKey | IDBKeyRange, index?: string | undefined) {
  const db = getMainDatabase()
  const prom = useCallback(() => {
    if(key === undefined) {
      return new Promise<T>((_, reject) => reject(undefined))
    }
    return new Promise<T>((resolve, reject) => {
      db.read<T>(tblName, key, index)
          .then(value => {
            const curTime = (new Date()).getTime()
            if(value !== undefined) {
              if(curTime < value.cached_at + getCacheDuration(tblName)) {
                resolve(value)
                return
              }
            }
            loadExternalCB()
                .then(value1 => {
                  const writeVal = value1.map(v => ({...v, cached_at: curTime}))
                  db.writeAll(tblName, writeVal)
                  const result = writeVal.find(findExternalCB)
                  if(result !== undefined) {
                    resolve(result)
                  } else {
                    reject(err404Data)
                  }
                }).catch(reason => reject(reason))
          })
          .catch(reason => reject(reason))
    })
  }, [db, tblName, key, index, loadExternalCB, findExternalCB, err404Data])
  return usePromisedData(prom, loadId)
}

export function useArrayCachedData<T extends cacheable>(
    tblName: string, loadId: string,
    loadExternalCB: () => Promise<Array<T>>, filterExternalCB: ((val: T) => boolean) | undefined,
    key?: IDBKeyRange | null, index?: string | undefined) {
  const db = getMainDatabase()
  const prom = useCallback(() => {
    if(key === undefined) {
      return new Promise<Array<T>>((resolve, reject) => reject(undefined))
    }
    return new Promise<Array<T>>((resolve, reject) => {
      db.readAll<T>(tblName, key===null?undefined:key, index)
          .then(value => {
            const curTime = (new Date()).getTime()
            if(value !== undefined) {
              let outdatedValues = value.filter(v => curTime > v.cached_at + getCacheDuration(tblName))
              if(outdatedValues.length === 0 && value.length > 0) {
                resolve(value)
                return
              }

              db.clearStore(tblName)
            }
            loadExternalCB()
                .then(value1 => {
                  const writeVal = value1.map(v => ({...v, cached_at: curTime}))
                  db.writeAll(tblName, writeVal)
                  if(filterExternalCB !== undefined) {
                    resolve(writeVal.filter(filterExternalCB))
                  } else {
                    resolve(writeVal)
                  }
                }).catch(reason => reject(reason))
          })
          .catch(reason => reject(reason))
    })
  }, [db, tblName, key, index, loadExternalCB, filterExternalCB])
  return usePromisedData(prom, loadId)
}
