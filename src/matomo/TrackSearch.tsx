import MatomoContext from "./MatomoContext"
import {useCallback, useContext} from "react"
import {getBasicTrackingData, sendTrackingPayload} from "./TrackUtil"


export default function useTrackSearch() {
  const data = useContext(MatomoContext)

  return useCallback((keyword: string, category: string | undefined, result_count: number | undefined) => {
    // disable tracking if provider had been disabled
    if(data === undefined) return
    const trackData = getBasicTrackingData(data)

    const trackingPayload = {
      action_name: document.title,
      url: window.location.href,
      search: keyword,
      search_cat: category,
      search_count: (result_count === undefined)?undefined:result_count+"",
      ...trackData,
    }
    sendTrackingPayload(data, trackingPayload)
  }, [data])
}
