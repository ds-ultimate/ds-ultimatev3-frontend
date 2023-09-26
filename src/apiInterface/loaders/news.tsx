import {useArrayDataloaderCallback} from "../DataloaderCallback"
import {useArrayCachedData} from "../cacheInterface"
import {newsType} from "../../modelHelper/News"
import {getNews} from "../apiConf"
import {useMemo} from "react"


export function useNews() {
  const apiParams = useMemo(() => ({}), [])
  const downloadCB = useArrayDataloaderCallback<newsType>(apiParams, "news", getNews)
  return useArrayCachedData<newsType>(
      "news", "newsDownload", downloadCB, undefined, null)
}
