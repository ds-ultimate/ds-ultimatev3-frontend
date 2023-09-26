import axios, {AxiosResponse} from "axios"


/**
 * Class for caching return values of an API endpoint
 */
export class DataloaderArray<T> {
  listeners: Array<{then: (data: T[]) => void, catch: (error: any) => void}> = []
  data: T[] | null = null
  error: any | null = null
  inject: Partial<T>
  constructor(url: string, inject: Partial<T>) {
    this.callback = this.callback.bind(this)
    this.callbackErr = this.callbackErr.bind(this)
    this.inject = inject
    axios.get(url).then(this.callback).catch(this.callbackErr)
  }

  callback(response: AxiosResponse<any>) {
    const dat: T[] = (response.data as T[]).map(d => ({...d, ...this.inject}))
    this.data = dat
    this.listeners.forEach(l => l.then(dat))
  }

  callbackErr(error: any) {
    this.error = error
    this.listeners.forEach(l => l.catch(error))
  }

  getPromise() {
    return new Promise<T[]>((resolve, reject) => {
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
