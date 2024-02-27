import {worldType} from "../modelHelper/World"
import axios, {AxiosResponse} from "axios"
import {villagePureType} from "../modelHelper/Village"
import {getArrayCachedWorldData, getOneOfArrayCachedWorldData, useArrayCachedWorldData} from "./cacheInterfaceWorld"
import {playerPureType} from "../modelHelper/Player"
import {allyType} from "../modelHelper/Ally"
import {useCallback} from "react"


/**
 * this file provides easy access to the worlddata of a given world
 * the data itself will be fetched from a cache server and then cached in the localstorage
 */

class TmpDataloader<T> {
  // TODO rework api to give back JSON and use ArrayDataloader (or better useDataloaderCallback)
  listeners: Array<{then: (data: T) => void, catch: (error: any) => void}> = []
  data: T | null = null
  error: any | null = null
  constructor(url: string) {
    this.callback = this.callback.bind(this)
    this.callbackErr = this.callbackErr.bind(this)
    axios.get(url).then(this.callback).catch(this.callbackErr)
  }

  callback(response: AxiosResponse<any>) {
    this.data = response.data
    this.listeners.forEach(l => l.then(response.data))
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


const villageDataloaderCache: Map<string, TmpDataloader<string>> = new Map()
async function downloadVillageData(world: worldType) {
  const cacheKey = world.server__code + "_" + world.name

  let loader = villageDataloaderCache.get(cacheKey)
  if (loader === undefined) {
    loader = new TmpDataloader<string>("/temp/village.txt")
    villageDataloaderCache.set(cacheKey, loader)
  }

  const dat = await loader.getPromise()
  return dat.split("\n").map(entry => {
    const splitDat = entry.split(",")
    if(splitDat.length < 7) return undefined
    const [id, name, x, y, owner, points, bonus_id] = splitDat
    const village: villagePureType = {
      villageID: +id, name, x: +x, y: +y, owner: +owner, points: +points, bonus_id: +bonus_id,
    }
    return village
  }).filter(v => v !== undefined) as villagePureType[]
}


const playerDataloaderCache: Map<string, {
  player: TmpDataloader<string>,
  bashOff: TmpDataloader<string>,
  bashDef: TmpDataloader<string>,
  bashSup: TmpDataloader<string>,
  bashAll: TmpDataloader<string>,
}> = new Map()
async function downloadPlayerData(world: worldType) {
  const cacheKey = world.server__code + "_" + world.name

  let loader = playerDataloaderCache.get(cacheKey)
  if (loader === undefined) {
    loader = {
      player: new TmpDataloader<string>("/temp/player.txt"),
      bashOff: new TmpDataloader<string>("/temp/kill_att.txt"),
      bashDef: new TmpDataloader<string>("/temp/kill_def.txt"),
      bashSup: new TmpDataloader<string>("/temp/kill_sup.txt"),
      bashAll: new TmpDataloader<string>("/temp/kill_all.txt"),
    }

    playerDataloaderCache.set(cacheKey, loader)
  }

  const convertBash = (dat: string) => {
    let mapped: Map<number, {rank: number, points: number}> = new Map()
    dat.split("\n").forEach(entry => {
      const splitDat = entry.split(",")
      if(splitDat.length < 3) return undefined
      const [rank, id, points] = splitDat
      mapped.set(+id, {rank: +rank, points: +points})
    })
    return mapped
  }

  const playerDat = await loader.player.getPromise()
  const playerOff = await loader.bashOff.getPromise().then(convertBash)
  const bashDef = await loader.bashDef.getPromise().then(convertBash)
  const bashSup = await loader.bashSup.getPromise().then(convertBash)
  const bashAll = await loader.bashAll.getPromise().then(convertBash)

  return playerDat.split("\n").map(entry => {
    const splitDat = entry.split(",")
    if(splitDat.length < 6) return undefined
    const [id, name, ally_id, villages, points, rank] = splitDat
    const playerID = +id
    const player: playerPureType = {
      playerID, name, ally_id: +ally_id, village_count: +villages, points: +points, rank: +rank,
      offBash: playerOff.get(playerID)?.points as number,
      offBashRank: playerOff.get(playerID)?.rank as number,
      defBash: bashDef.get(playerID)?.points as number,
      defBashRank: bashDef.get(playerID)?.rank as number,
      supBash: bashSup.get(playerID)?.points as number,
      supBashRank: bashSup.get(playerID)?.rank as number,
      gesBash: bashAll.get(playerID)?.points as number,
      gesBashRank: bashAll.get(playerID)?.rank as number,
    }
    return player
  }).filter(v => v !== undefined) as playerPureType[]
}


const allyDataloaderCache: Map<string, {
  ally: TmpDataloader<string>,
  bashOff: TmpDataloader<string>,
  bashDef: TmpDataloader<string>,
  bashAll: TmpDataloader<string>,
}> = new Map()
async function downloadAllyData(world: worldType) {
  const cacheKey = world.server__code + "_" + world.name

  let loader = allyDataloaderCache.get(cacheKey)
  if (loader === undefined) {
    loader = {
      ally: new TmpDataloader<string>("/temp/ally.txt"),
      bashOff: new TmpDataloader<string>("/temp/kill_att_tribe.txt"),
      bashDef: new TmpDataloader<string>("/temp/kill_def_tribe.txt"),
      bashAll: new TmpDataloader<string>("/temp/kill_all_tribe.txt"),
    }

    allyDataloaderCache.set(cacheKey, loader)
  }

  const convertBash = (dat: string) => {
    let mapped: Map<number, {rank: number, points: number}> = new Map()
    dat.split("\n").forEach(entry => {
      const splitDat = entry.split(",")
      if(splitDat.length < 3) return undefined
      const [rank, id, points] = splitDat
      mapped.set(+id, {rank: +rank, points: +points})
    })
    return mapped
  }

  const allyDat = await loader.ally.getPromise()
  const allyOff = await loader.bashOff.getPromise().then(convertBash)
  const allyDef = await loader.bashDef.getPromise().then(convertBash)
  const allyAll = await loader.bashAll.getPromise().then(convertBash)

  return allyDat.split("\n").map(entry => {
    const splitDat = entry.split(",")
    if(splitDat.length < 8) return undefined
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [id, name, tag, members, villages, _points, all_points, rank] = splitDat
    const allyID = +id
    const ally: allyType = {
      allyID, name, tag, member_count: +members, village_count: +villages, points: +all_points, rank: +rank,
      offBash: allyOff.get(allyID)?.points as number,
      offBashRank: allyOff.get(allyID)?.rank as number,
      defBash: allyDef.get(allyID)?.points as number,
      defBashRank: allyDef.get(allyID)?.rank as number,
      gesBash: allyAll.get(allyID)?.points as number,
      gesBashRank: allyAll.get(allyID)?.rank as number,
    }
    return ally
  }).filter(v => v !== undefined) as allyType[]
}

export function getVillageInfoXY(world: worldType, x: number, y: number) {
  return getOneOfArrayCachedWorldData<villagePureType>(
      world, "village", () => downloadVillageData(world),
      [x, y], "coordinates")
}

export function getVillageInfoId(world: worldType, id: number) {
  return getOneOfArrayCachedWorldData<villagePureType>(
      world, "village", () => downloadVillageData(world),
      [id])
}

export function useAllVillages(world: worldType) {
  const downloadCB = useCallback(() => downloadVillageData(world), [world])

  return useArrayCachedWorldData<villagePureType>(
      world, "village", "villageWorldData", downloadCB, null)
}

export function getAllVillages(world: worldType) {
  return getArrayCachedWorldData<villagePureType>(
      world, "village", () => downloadVillageData(world), null)
}

export function getPlayerInfoId(world: worldType, id: number) {
  return getOneOfArrayCachedWorldData<playerPureType>(
      world, "player", () => downloadPlayerData(world),
      [id])
}

export function useAllPlayers(world: worldType) {
  const downloadCB = useCallback(() => downloadPlayerData(world), [world])

  return useArrayCachedWorldData<playerPureType>(
      world, "player", "playerWorldData", downloadCB, null)
}

export function getAllPlayers(world: worldType) {
  return getArrayCachedWorldData<playerPureType>(
      world, "player", () => downloadPlayerData(world), null)
}
