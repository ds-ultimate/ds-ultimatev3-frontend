import {useCallback} from "react"
import {Dataloader} from "./dataloader"
import {routeGenerator} from "./apiConf"
import {Dict} from "../util/customTypes"
import {DataloaderArray} from "./dataloaderArray"


const dataloaderCache: Dict<Dataloader<any>> = {}

/**
 * Provides a callback that will provide a Dataloader with the given options
 * @param p The parameters that will be used for the route and inserted into the data after retrieval
 * @param cacheKey A unique name for that data. Should be the same if the api will be called with the same arguments.
 * @param route The route of the api
 * @param routeParams Parameters that are only inserted into the route and not into the model
 */
export function useDataloaderCallback<T>(p: (Partial<T> & Dict<string>) | undefined,
    cacheKey: string, route: routeGenerator, routeParams?: Dict<string>): () => Promise<T> {
  return useCallback((): Promise<T> => {
    if(p === undefined) {
      return new Promise((resolve, reject) => reject(undefined))
    }

    let loader = dataloaderCache[cacheKey]
    if(loader !== undefined) {
      return loader.getPromise()
    }

    loader = new Dataloader<T>(route({...p, ...routeParams}), p)
    dataloaderCache[cacheKey] = loader
    return loader.getPromise()
  }, [cacheKey, p, route, routeParams])
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
