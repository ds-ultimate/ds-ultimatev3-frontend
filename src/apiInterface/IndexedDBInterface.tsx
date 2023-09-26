import {Dict} from "../util/customTypes"

export type upgradeEvent = ((this: IDBOpenDBRequest, ev: IDBVersionChangeEvent) => any) | null
const interfaceCache: Dict<IndexedDBInterface> = {}
class IndexedDBInterface {
  listeners: Array<{then: (data: IDBDatabase) => void, catch: (error: any) => void}> = []
  request: IDBOpenDBRequest
  data: IDBDatabase | null = null
  error: any | null = null
  constructor(name: string, version: number, onUpdate: upgradeEvent) {
    this.callback = this.callback.bind(this)
    this.callbackErr = this.callbackErr.bind(this)

    this.request = indexedDB.open(name, version)
    this.request.onupgradeneeded = onUpdate
    this.request.addEventListener("success", this.callback)
    this.request.addEventListener("error", this.callbackErr)
  }

  callback() {
    this.data = this.request.result
    this.listeners.forEach(l => l.then(this.request.result))
  }

  callbackErr() {
    const error = "Error opening indexed db"
    this.error = error
    this.listeners.forEach(l => l.catch(error))
  }

  getPromise() {
    return new Promise<IDBDatabase>((resolve, reject) => {
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


export function get_indexedDB(name: string, version: number, onUpdate: upgradeEvent) {
  let dbInterface = interfaceCache[name]
  if(dbInterface !== undefined) {
    return dbInterface.getPromise()
  }
  dbInterface = new IndexedDBInterface(name, version, onUpdate)
  interfaceCache[name] = dbInterface
  return dbInterface.getPromise()
}
