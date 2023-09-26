import {Dict} from "../util/customTypes"

//How long each cache is valid in seconds
const CACHE_DURATION: Dict<number> = {
  "server": 24 * 60 * 60,
  "world": 24 * 60 * 60,
  "worldExtended": 24 * 60 * 60,
  "changelog": 24 * 60 * 60,
  "news": 24 * 60 * 60,
  "allyBasic": 30 * 60,
  "allyChart": 30 * 60,
  "playerBasic": 30 * 60,
  "playerChart": 30 * 60,
  "villageBasic": 30 * 60,
}

export function getCacheDuration(tblName: string) {
  const res = CACHE_DURATION[tblName]
  if(res === undefined) {
    throw Error("Unknown table name " + tblName)
  }
  return res * 1000
}
