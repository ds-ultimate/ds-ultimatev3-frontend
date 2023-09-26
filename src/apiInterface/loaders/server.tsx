import {useArrayDataloaderCallback} from "../DataloaderCallback"
import {useArrayCachedData, useOneOfArrayCachedData} from "../cacheInterface"
import {serverType} from "../../modelHelper/Server"
import {getServers} from "../apiConf"
import {useCallback, useMemo} from "react"
import {FrontendError} from "../../pages/layout/ErrorPages/ErrorTypes"


export function useServers() {
  const apiParams = useMemo(() => ({}), [])
  const downloadCB = useArrayDataloaderCallback<serverType>(apiParams, "server", getServers)
  return useArrayCachedData<serverType>(
      "server", "serversDownload", downloadCB, undefined, null)
}

export function useServer(server: string | undefined) {
  const dbKey =
      useMemo(() => {
        if(server === undefined) {
          return undefined
        }
        return [server]
      }, [server])
  const apiParams = useMemo(() => ({}), [])
  const downloadCB = useArrayDataloaderCallback<serverType>(apiParams, "server", getServers)
  const findCB = useCallback(
      (s: serverType) => s.code === server,
      [server])
  const error: FrontendError = useMemo(() => ({
    isFrontend: true,
    code: 404,
    k: "404.noServer",
    p: {server: (server ?? "")}
  }), [server])
  return useOneOfArrayCachedData<serverType>(
      "server", "serversDownload", downloadCB, findCB, error, dbKey, "code")
}
