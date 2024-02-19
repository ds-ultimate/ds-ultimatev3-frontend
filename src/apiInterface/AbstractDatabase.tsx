import {get_indexedDB, upgradeEvent} from "./IndexedDBInterface"


export type cacheable = {
  cached_at: number,
}

export class AbstractDatabase {
  db: IDBDatabase | undefined = undefined
  listeners: Array<{then: (db: IDBDatabase) => void}> = []
  constructor(dbName: string, dbVersion: number, upgradeFunc: upgradeEvent) {
    get_indexedDB(dbName, dbVersion, upgradeFunc)
        .then(db => {
          this.db = db
          this.listeners.forEach(value => value.then(db))
        })
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
    return new Promise<T []>((resolve, reject) => {
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
