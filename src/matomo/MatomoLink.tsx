import MatomoContext from "./MatomoContext"
import {ComponentType, ReactNode, useCallback, useContext} from "react"
import {getBasicTrackingData, sendTrackingPayload} from "./TrackUtil"


type linkProps<P> = {
  as: string | ComponentType<P>,
  children: ReactNode | ReactNode[],
  isDownload?: boolean,
  params: P,
}

export default function MatomoLink<P>({as, children, isDownload, params}: linkProps<P>) {
  const data = useContext(MatomoContext)
  const Component = as

  const logClick = useCallback(async (e: MouseEvent) => {
    // disable tracking if provider had been disabled
    if(data === undefined) return
    e.preventDefault()
    const trackData = getBasicTrackingData(data)

    const trackingRaw = {
      action_name: document.title,
      url: (params as any).href,
      ...trackData,
    }

    const trackingPayload = isDownload?
        {download: trackingRaw.url, ...trackingRaw}:
        {link: trackingRaw.url, ...trackingRaw}

    await sendTrackingPayload(data, trackingPayload)
    window.location.href = (params as any).href
  }, [isDownload, data, params])

  if((params as any).href === undefined) {
    throw new Error("Must not use MatomoLink without href")
  }

  if(data === undefined) {
    // disable tracking if provider had been disabled
    return (
        <Component {...params}>
          {children}
        </Component>
    )
  }

  return (
      <Component {...params} onClick={logClick}>
        {children}
      </Component>
  )
}
