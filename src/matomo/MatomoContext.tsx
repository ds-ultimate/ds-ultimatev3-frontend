import {createContext} from "react"


export type MatomoStateDataType = {
  userId: string
}

export type MatomoContextType = {
  trackUrl: string,
  siteId: number,
  userId: string,
  pageViewId: string,
}

export default createContext<undefined | MatomoContextType>(undefined)
