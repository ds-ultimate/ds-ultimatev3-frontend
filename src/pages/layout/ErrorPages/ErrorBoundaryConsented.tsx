import {ReactNode} from "react"
import {useIsConsented} from "../CookieConsent"
import {ErrorBoundary} from "react-error-boundary"
import ErrorPage, {logError} from "../ErrorPage"


export default function ErrorBoundaryConsented({children}: {children: ReactNode | ReactNode[]}) {
  const active = useIsConsented("errorReports")

  return (
      <ErrorBoundary fallbackRender={ErrorPage} onError={active?logError:undefined}>
        {children}
      </ErrorBoundary>
  )
}
