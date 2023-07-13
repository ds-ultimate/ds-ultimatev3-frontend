import {AxiosError} from "axios";
import ErrorPage404 from "./ErrorPages/ErrorPage404";

export default function ErrorPage({error}: {error: any}) {
  //TODO this page should act as a hub for: 404, 403, Maintenance Mode (world / global)
  //503 world -> translated (503.worldDown with p:{world:string}) ; 503 global without translation
  if(error.isAxiosError) {
    const err = error as AxiosError
    if(err.response) {
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
  console.log(error)

  return (
      <>
        Something went somewhere wrong :/<br />
        The error page is still under construction
      </>
  )
}
