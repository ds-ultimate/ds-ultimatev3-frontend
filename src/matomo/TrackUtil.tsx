import {MatomoContextType} from "./MatomoContext"
import {Dict} from "../util/customTypes"
import axios from "axios"


const delay = (ms: number) => new Promise(
    resolve => setTimeout(resolve, ms)
)

export function sendTrackingPayload(data: MatomoContextType, payload: Dict<string>) {
  return axios.post(data.trackUrl, {}, {params: payload, headers: {Authorization: null}})
      .catch(reason => {
        //error during tracking -> disable it
        data.disable()
      })
}

export function getBasicTrackingData(data: MatomoContextType) {
  /**
   * TODO user_id
   * Optional stuff to put in:
   *
   * uid — defines the User ID for this request. User ID is any non-empty unique string identifying the user (such as an email address or a username).
   * To access this value, users must be logged-in in your system so you can fetch this user ID from your system, and pass it to Matomo.
   * The User ID appears in the visits log, the Visitor profile, and you can Segment reports for one or several User ID (userId segment).
   * When specified, the User ID will be "enforced". This means that if there is no recent visit with this User ID, a new one will be created.
   * If a visit is found in the last 30 minutes with your specified User ID, then the new action will be recorded to this existing visit.
   *
   */

  const result: Dict<string> = {
    idsite: data.siteId + "",
    rec: 1 + "",
    rand: Math.round(Math.random() * 10000) + "",
    _id: data.userId + "",
    apiv: "1",
    pv_id: data.pageViewId,

    urlref: document.referrer,
    res: window.screen.width + "x" + window.screen.height,
    devicePixelRatio: window.devicePixelRatio+"",
    h: (new Date()).getHours()+"",
    m: (new Date()).getMinutes()+"",
    s: (new Date()).getSeconds()+"",
    pdf: navigator.pdfViewerEnabled ? "1": "0",
    cookie: navigator.cookieEnabled ? "1" : "0",
  }
  return result
}

//Various methods of getting the browserfeatures have been copied from https://github.com/matomo-org/matomo/blob/5.x-dev/js/piwik.js
export async function getTelemetry(data: MatomoContextType, isInitial: boolean) {
  const result = getBasicTrackingData(data)

  if(!isInitial) {
    return result
  }

  const windowAlias = window as any
  const performanceAlias = windowAlias.performance || windowAlias.mozPerformance || windowAlias.msPerformance || windowAlias.webkitPerformance
  let performanceData = (typeof performanceAlias.timing === 'object') && performanceAlias.timing ? performanceAlias.timing : undefined;

  if (!performanceData) {
    performanceData = (typeof performanceAlias.getEntriesByType === 'function') && performanceAlias.getEntriesByType('navigation') ? performanceAlias.getEntriesByType('navigation')[0] : undefined;
  }

  // note: there might be negative values because of browser bugs see https://github.com/matomo-org/matomo/pull/16516 in this case we ignore the values
  function grabPerformaceData(valFrom: number | undefined, valTo: number | undefined) {
    if (valFrom && valTo) {
      if (valTo < valFrom) {
        return undefined
      }
      return "" + Math.round(valTo - valFrom)
    }
    return undefined
  }

  let gotTelemetryCounter = 20
  while(gotTelemetryCounter > 0) {
    const tmpTelemetry = {
      pf_net: grabPerformaceData(performanceData?.fetchStart, performanceData?.connectEnd),
      pf_srv: grabPerformaceData(performanceData?.requestStart, performanceData?.responseStart),
      pf_tfr: grabPerformaceData(performanceData?.responseStart, performanceData?.responseEnd),
      pf_dm1: (performanceData?.domLoading !== "undefined")?
          grabPerformaceData(performanceData?.domLoading, performanceData?.domInteractive):
          grabPerformaceData(performanceData?.responseEnd, performanceData?.domInteractive),
      pf_dm2: grabPerformaceData(performanceData?.domInteractive, performanceData?.domComplete),
      pf_onl: grabPerformaceData(performanceData?.loadEventStart, performanceData?.loadEventEnd),
    }

    if(tmpTelemetry.pf_net !== undefined &&
        tmpTelemetry.pf_srv !== undefined &&
        tmpTelemetry.pf_tfr !== undefined &&
        tmpTelemetry.pf_dm1 !== undefined &&
        tmpTelemetry.pf_dm2 !== undefined &&
        tmpTelemetry.pf_onl !== undefined) {
      return {
        ...tmpTelemetry,
        ...result,
      }
    } else {
      gotTelemetryCounter--
      await delay(200)
    }
  }

  //we could not gather first time telemetry
  return result
}
