import {useCallback} from "react"
import {Dataloader} from "./dataloader"
import {routeGenerator} from "./apiConf"
import {Dict} from "../util/customTypes"
import {DataloaderArray} from "./dataloaderArray"


const dataloaderCache: Dict<Dataloader<any>> = {}
export function useDataloaderCallback<T>(p: (Partial<T> & Dict<string>) | undefined,
    cacheKey: string, route: routeGenerator): () => Promise<T> {
  return useCallback((): Promise<T> => {
    if(p === undefined) {
      return new Promise((resolve, reject) => reject(undefined))
    }

    let loader = dataloaderCache[cacheKey]
    if(loader !== undefined) {
      return loader.getPromise()
    }

    loader = new Dataloader<T>(route(p), p)
    dataloaderCache[cacheKey] = loader
    return loader.getPromise()
  }, [cacheKey, p, route])
}

const dataloaderArrayCache: Dict<DataloaderArray<any>> = {}
export function useArrayDataloaderCallback<T>(p: (Partial<T> & Dict<string>) | undefined,
                                         cacheKey: string, route: routeGenerator): () => Promise<T[]> {
  return useCallback((): Promise<T[]> => {
    if(p === undefined) {
      return new Promise((resolve, reject) => reject(undefined))
    }

    let loader = dataloaderArrayCache[cacheKey]
    if(loader !== undefined) {
      return loader.getPromise()
    }

    loader = new DataloaderArray<T>(route(p), p)
    dataloaderArrayCache[cacheKey] = loader
    return loader.getPromise()
  }, [cacheKey, p, route])
}
