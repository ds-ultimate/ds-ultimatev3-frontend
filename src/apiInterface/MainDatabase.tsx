import {get_indexedDB, upgradeEvent} from "./IndexedDBInterface"
import {getCacheDuration} from "./cacheConf"


export type cacheable = {
  cached_at: number,
}
const MAIN_DATABASE_VERSION = 1
let mainDBCache: MainDatabase | undefined = undefined

class MainDatabase {
  db: IDBDatabase | undefined = undefined
  listeners: Array<{then: (db: IDBDatabase) => void}> = []
  constructor() {
    get_indexedDB("mainCache", MAIN_DATABASE_VERSION, upgradeDB)
        .then(db => {
          this.db = db
          this.listeners.forEach(value => value.then(db))
        })

    removeOutdatedEntries(this)
  }

  scheduleCommand(command: (db: IDBDatabase) => void) {
    if(this.db !== undefined) {
      command(this.db)
    } else {
      this.listeners.push({then: command})
    }
  }

  read<T>(tblName: string, key: IDBValidKey | IDBKeyRange, index?: string | undefined) {
    return new Promise<T | undefined>((resolve, reject) => {
      this.scheduleCommand(db => {
        const tx = db.transaction(tblName, 'readonly')
        const store = tx.objectStore(tblName)
        let request: IDBRequest<any>
        if(index === undefined) {
          request = store.get(key)
        } else {
          const idx = store.index(index)
          request = idx.get(key)
        }
        request.onsuccess = () => {
          resolve(request.result)
        }
        request.onerror = () => {
          reject(request.error)
        }
      })
    })
  }

  write(tblName: string, data: any) {
    const doWrite = (db: IDBDatabase) => {
      const tx = db.transaction(tblName, 'readwrite')
      const store = tx.objectStore(tblName)
      store.put(data)
      tx.commit()
    }
    this.scheduleCommand(doWrite)
  }

  readAll<T>(tblName: string, key?: IDBKeyRange, index?: string | undefined) {
    return new Promise<Array<T> | undefined>((resolve, reject) => {
      this.scheduleCommand(db => {
        const tx = db.transaction(tblName, 'readonly')
        const store = tx.objectStore(tblName)
        let request: IDBRequest<any[]>
        if(index === undefined) {
          request = store.getAll(key)
        } else {
          const idx = store.index(index)
          request = idx.getAll(key)
        }
        request.onsuccess = () => {
          resolve(request.result)
        }
        request.onerror = () => {
          reject(request.error)
        }
      })
    })
  }

  writeAll(tblName: string, data: Array<any>) {
    const doWrite = (db: IDBDatabase) => {
      const tx = db.transaction(tblName, 'readwrite')
      const store = tx.objectStore(tblName)
      data.forEach(value => store.put(value))
      tx.commit()
    }
    this.scheduleCommand(doWrite)
  }

  clearStore(tblName: string) {
    const doClear = (db: IDBDatabase) => {
      const tx = db.transaction(tblName, 'readwrite')
      const store = tx.objectStore(tblName)
      store.clear()
      tx.commit()
    }
    this.scheduleCommand(doClear)
  }
}

const upgradeDB: upgradeEvent = function() {
  const db = this.result
  //event.oldVersion == 0 if db is being created (event = param of function)
  if(!db.objectStoreNames.contains("server")) {
    const serverStore = db.createObjectStore("server", {keyPath: 'id'})
    serverStore.createIndex("code", ["code"], {unique: true})
  }
  if(!db.objectStoreNames.contains("world")) {
    const worldObjStore = db.createObjectStore("world", {keyPath: 'id'})
    worldObjStore.createIndex("world, server", ["name", "server__code"], {unique: true})
    worldObjStore.createIndex("server__code", "server__code", {unique: false})
    worldObjStore.createIndex("server__code, active", ["server__code", "active"], {unique: false})
  }
  if(!db.objectStoreNames.contains("worldExtended")) {
    const worldExtended = db.createObjectStore("worldExtended", {keyPath: ['world', 'server']})
    worldExtended.createIndex("cached_at", "cached_at", {unique: false})
  }
  if(!db.objectStoreNames.contains("changelog")) {
    db.createObjectStore("changelog", {keyPath: 'id'})
  }
  if(!db.objectStoreNames.contains("news")) {
    db.createObjectStore("news", {keyPath: 'id'})
  }
  if(!db.objectStoreNames.contains("allyBasic")) {
    const allyBasic = db.createObjectStore("allyBasic", {keyPath: ['id', 'world', 'server']})
    allyBasic.createIndex("cached_at", "cached_at", {unique: false})
  }
  if(!db.objectStoreNames.contains("allyChart")) {
    const allyChart = db.createObjectStore("allyChart", {keyPath: ['id', 'world', 'server']})
    allyChart.createIndex("cached_at", "cached_at", {unique: false})
  }
  if(!db.objectStoreNames.contains("playerBasic")) {
    const playerBasic = db.createObjectStore("playerBasic", {keyPath: ['id', 'world', 'server']})
    playerBasic.createIndex("cached_at", "cached_at", {unique: false})
  }
  if(!db.objectStoreNames.contains("playerChart")) {
    const playerChart = db.createObjectStore("playerChart", {keyPath: ['id', 'world', 'server']})
    playerChart.createIndex("cached_at", "cached_at", {unique: false})
  }
  if(!db.objectStoreNames.contains("villageBasic")) {
    const villageBasic = db.createObjectStore("villageBasic", {keyPath: ['id', 'world', 'server']})
    villageBasic.createIndex("cached_at", "cached_at", {unique: false})
  }
  if(!db.objectStoreNames.contains("villageAllyCached")) {
    const villageBasic = db.createObjectStore("villageAllyCached", {keyPath: ['villageID', 'world', 'server']})
    villageBasic.createIndex("x, y, world, server", ["x", "y", "world", "server"], {unique: true})
    villageBasic.createIndex("cached_at", "cached_at", {unique: false})
  }
}

function removeOutdatedEntries(mainDB: MainDatabase) {
  const stores = [
    {name: "server", allAtOnce: true},
    {name: "world", allAtOnce: true},
    {name: "worldExtended", allAtOnce: false},
    {name: "changelog", allAtOnce: true},
    {name: "news", allAtOnce: true},
    {name: "allyBasic", allAtOnce: false},
    {name: "allyChart", allAtOnce: false},
    {name: "playerBasic", allAtOnce: false},
    {name: "playerChart", allAtOnce: false},
    {name: "villageBasic", allAtOnce: false},
    {name: "villageAllyCached", allAtOnce: false},
  ]

  stores.forEach(s => {
    if(s.allAtOnce) {
      checkAllAtOnceCache(mainDB, s.name)
    } else {
      checkSingleEntryCache(mainDB, s.name)
    }
  })
}

function checkAllAtOnceCache(mainDB: MainDatabase, storeName: string) {
  mainDB.readAll<cacheable>(storeName).then(value => {
    const curTime = (new Date()).getTime()
    if(value !== undefined) {
      let outdatedValues = value.filter(v => curTime > v.cached_at + getCacheDuration(storeName))
      if (outdatedValues.length === 0 && value.length > 0) {
        return
      }

      mainDB.clearStore(storeName)
    }
  })
}

function checkSingleEntryCache(mainDB: MainDatabase, storeName: string) {
  mainDB.scheduleCommand(db => {
    const tx = db.transaction(storeName, "readwrite")
    const store = tx.objectStore(storeName)
    const index = store.index("cached_at")
    const range = IDBKeyRange.upperBound((new Date()).getTime() - getCacheDuration(storeName))
    const request = index.openCursor(range)
    request.onsuccess = () => {
      const cursor = request.result
      if(!cursor) {
        return
      }
      cursor.delete()
      cursor.continue()
    }
  })
}

export function getMainDatabase() {
  if(mainDBCache === undefined) {
    mainDBCache = new MainDatabase()
  }
  return mainDBCache
}
