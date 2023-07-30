import {MatomoContextType} from "./MatomoContext"
import {getTelemetry, sendTrackingPayload} from "./TrackUtil"


export default async function TrackPageVisit(data: MatomoContextType, isPing: boolean, isInitial: boolean) {
  const basicData = await getTelemetry(data, isInitial)
  if(data.trackUrl === "") return

  const trackingPayload = {
    action_name: document.title,
    url: window.location.href,
    ping: isPing ? "1" : "0",
    ...basicData,
  }
  sendTrackingPayload(data, trackingPayload)
}
