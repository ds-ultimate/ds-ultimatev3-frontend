import axios, {AxiosError} from "axios";
import ErrorPage404 from "./ErrorPages/ErrorPage404";
import ErrorPage403 from "./ErrorPages/ErrorPage403";
import {errorReporting} from "../../apiInterface/apiConf"
import {FrontendError} from "./ErrorPages/ErrorTypes"

export const GenericFrontendError: FrontendError = {
  isFrontend: true,
  code: 500,
  k: "500.generic", //TODO translations for this
  p: {},
}

export default function ErrorPage({error}: {error: any}) {
  //TODO this page should act as a hub for: Maintenance Mode (world / global)
  //503 world -> translated (503.worldDown with p:{world:string}) ; 503 global without translation

  //TODO rewrite all default messages
  if(error.isAxiosError) {
    const err = error as AxiosError
    if(err.response) {
      if(err.response.status === 403) {
        return <ErrorPage403 error={err} />
      }
      if(err.response.status === 404) {
        return <ErrorPage404 error={err} />
      }
    }
    console.log(error)

    return (
        <>
          Something went somewhere wrong :/<br />
          {err.response?.status + ""}<br />
          {err.isAxiosError + ""}<br />
          {/* TODO use custom return type for our errors here (also laravel errors) */}
        </>
    )
  }
  if(error.isFrontend) {
    const err = error as FrontendError
    if(err.code === 403) {
      return <ErrorPage403 error={err} />
    }
    if(err.code === 404) {
      return <ErrorPage404 error={err} />
    }
    console.log(error)

    return (
        <>
          Something went somewhere wrong :/<br />
          {err.code + ""}<br />
          {/* TODO use custom return type for our errors here (also laravel errors) */}
        </>
    )
  }
  console.log(error)

  return (
      <>
        Something went somewhere wrong :/<br />
        The error page is still under construction
      </>
  )
}

export function logError(error: Error, info: {componentStack: string}) {
  const postPayload = {
    msg: error.message,
    name: error.name,
    stack: error.stack ?? "",
    comp: info.componentStack,
    url: window.location.href,
  }

  const endpoint = errorReporting({})
  axios.post(endpoint, postPayload)
}
