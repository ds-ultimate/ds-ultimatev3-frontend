import axios, {AxiosError} from "axios";
import ErrorPage404 from "./ErrorPages/ErrorPage404";
import ErrorPage403 from "./ErrorPages/ErrorPage403";
import {errorReporting} from "../../apiInterface/apiConf"
import {FrontendError} from "./ErrorPages/ErrorTypes"
import ErrorPage500 from "./ErrorPages/ErrorPage500"
import {Card, Col, Row} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import ErrorPage503 from "./ErrorPages/ErrorPage503"

export const GenericFrontendError: FrontendError = {
  isFrontend: true,
  code: 500,
  k: "500.generic",
  p: {},
}

export default function ErrorPage({error}: {error: any}) {
  const { t } = useTranslation("error")

  if(error.isAxiosError) {
    const err = error as AxiosError
    if(err.response) {
      if(err.response.status === 403) {
        return <ErrorPage403 error={err} />
      }
      if(err.response.status === 404) {
        return <ErrorPage404 error={err} />
      }
      if(err.response.status === 500) {
        return <ErrorPage500 error={err} />
      }
      if(err.response.status === 503) {
        return <ErrorPage503 error={err} />
      }
    }
  }
  if(error.isFrontend) {
    const err = error as FrontendError
    if(err.code === 403) {
      return <ErrorPage403 error={err} />
    }
    if(err.code === 404) {
      return <ErrorPage404 error={err} />
    }
    if(err.code === 500) {
      return <ErrorPage500 error={err} />
    }
  }

  console.log(error)
  return (
      <Row className={"justify-content-center p-3"}>
        <Col xs={12} className={"p-lg-5 mx-auto my-1 text-center"}>
          <h1 className={"fw-normal"}>{t("500.title")}</h1>
        </Col>
        <Col xs={12}>
          <Card>
            <Card.Body className={"text-center"}>
              {t("500.generic")}
            </Card.Body>
          </Card>
        </Col>
      </Row>
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
