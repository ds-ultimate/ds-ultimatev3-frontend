import {ReactNode} from "react"
import {useIsConsented} from "./pages/layout/CookieConsent"
import {MatomoProvider} from "./matomo"


export default function Matomo({children}: {children: ReactNode | ReactNode[]}) {
  const active = useIsConsented("matomo")

  if(active) {
    return (
        <MatomoProvider
            urlBase={'https://matomo.ds-ultimate.de'}
            siteId={3}
            heartBeatInterval={10}
        >
          {children}
        </MatomoProvider>
    )
  } else {
    return <>{children}</>
  }
}