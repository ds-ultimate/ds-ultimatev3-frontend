import {useArrayDataloaderCallback} from "../DataloaderCallback"
import {getChangelogs} from "../apiConf"
import {useArrayCachedData} from "../cacheInterface"
import {changelogType} from "../../modelHelper/Changelog"
import {useMemo} from "react"


export function useChangelog() {
  const apiParams = useMemo(() => ({}), [])
  const downloadCB = useArrayDataloaderCallback<changelogType>(apiParams, "changelog", getChangelogs)
  return useArrayCachedData<changelogType>(
      "changelog", "changelogPage", downloadCB, undefined, null)
}
