import {upgradeEvent} from "./IndexedDBInterface"
import {worldType} from "../modelHelper/World"
import {AbstractDatabase} from "./AbstractDatabase"


const WORLD_DATA_VERSION = 1
let worldDBCache: Map<string, WorldDatabase> = new Map()

export class WorldDatabase extends AbstractDatabase {
  constructor(world: worldType) {
    super("world_" + world.server__code + world.name + "_cache", WORLD_DATA_VERSION, upgradeDB)
  }
}

const upgradeDB: upgradeEvent = function() {
  const db = this.result
  //event.oldVersion == 0 if db is being created (event = param of function)
  if(!db.objectStoreNames.contains("ally")) {
    const ally = db.createObjectStore("ally", {keyPath: ['allyID']})
    ally.createIndex("name", "name", {unique: false})
    ally.createIndex("tag", "tag", {unique: false})
    ally.createIndex("cached_at", "cached_at", {unique: false})
  }
  if(!db.objectStoreNames.contains("player")) {
    const player = db.createObjectStore("player", {keyPath: ['playerID']})
    player.createIndex("name", "name", {unique: false})
    player.createIndex("ally_id", "ally_id", {unique: false})
    player.createIndex("cached_at", "cached_at", {unique: false})
  }
  if(!db.objectStoreNames.contains("village")) {
    const village = db.createObjectStore("village", {keyPath: ['villageID']})
    village.createIndex("coordinates", ["x", "y"], {unique: true})
    village.createIndex("name", "name", {unique: false})
    village.createIndex("owner", "owner", {unique: false})
    village.createIndex("bonus_id", "bonus_id", {unique: false})
    village.createIndex("cached_at", "cached_at", {unique: false})
  }
}

export function getWorldDatabase(world: worldType) {
  let worldDB = worldDBCache.get(world.server__code + world.name)
  if(worldDB === undefined) {
    worldDB = new WorldDatabase(world)
    worldDBCache.set(world.server__code + world.name, worldDB)
  }
  return worldDB
}
