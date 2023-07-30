import {ReactNode, useEffect, useMemo, useState} from "react"
import MatomoContext, {MatomoContextType, MatomoStateDataType} from "./MatomoContext"
import {useLocation} from "react-router-dom"
import usePersistentState from "../util/persitentState"
import TrackPageVisit from "./TrackPageVisit"

type params = {
  urlBase: string,
  siteId: number,
  heartBeatInterval: number,
  children: ReactNode | ReactNode[],
}

export default function MatomoProvider({urlBase, siteId, heartBeatInterval, children}: params) {
  const [{userId},] = usePersistentState<MatomoStateDataType>("matomo", () => {
    const datePart = Date.now().toString(16)
    const randPart = Math.round(Math.random() * 16777216).toString(16)
    const userId = datePart.slice(datePart.length - 10) + randPart.slice(randPart.length - 6)
    return {userId}
  })
  const [state, setState] =
      useState<{lastLocation: string | undefined, pageViewId: string}>({lastLocation: undefined, pageViewId: "XXXX"})

  const location = useLocation()
  const data: MatomoContextType = useMemo(() => {return {
    trackUrl: urlBase + "/matomo.php",
    siteId,
    userId,
    pageViewId: state.pageViewId
  }}, [urlBase, siteId, userId, state.pageViewId])

  useEffect(() => {
    if(state.lastLocation !== location.pathname) {
      const initial = state.lastLocation === undefined
      const pageViewId = (Math.round(Math.random() * 65536)).toString(16)
      const modifiedData = {
        ...data,
        pageViewId: pageViewId
      }
      TrackPageVisit(modifiedData,false, initial)
      setState({lastLocation: location.pathname, pageViewId})
    }

    const timerId = setInterval(() => {
      TrackPageVisit(data, true, false)
    }, heartBeatInterval*1000)

    return () => {
      clearInterval(timerId)
    }
  }, [heartBeatInterval, data, location, state]);

  return (
      <MatomoContext.Provider value={data}>
        {children}
      </MatomoContext.Provider>
  )
}
