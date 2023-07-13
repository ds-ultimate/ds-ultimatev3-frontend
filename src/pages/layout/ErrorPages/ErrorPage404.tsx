import {AxiosError} from "axios";
import {useTranslation} from "react-i18next";
import {Dict} from "../../../util/customTypes";
import {Card, Col, Container, Row} from "react-bootstrap";

export type LaravelErrorMessage = {
  message: string,
}

export type TranslatedError = {
  k: string,
  p: Dict<string>,
}

export default function ErrorPage404({error}: {error: AxiosError}) {
  const { t } = useTranslation("error")
  //TODO log 404 at ? (create a concept for monitoring errors)

  let message = t("404.generic")

  if(error.response && error.response.data &&
      typeof(error.response?.data) === "object" && (error.response?.data as any).message) {
    const laravelErr = error.response.data as LaravelErrorMessage
    message = laravelErr.message

    if(laravelErr.message.startsWith("CUSTOM_")) {
      const customErr = JSON.parse(laravelErr.message.substring("CUSTOM_".length)) as TranslatedError
      message = t(customErr.k, customErr.p)
    }
  }
  return (
      <Row className={"justify-content-center p-3"}>
        <Col xs={12} className={"p-lg-5 mx-auto my-1 text-center"}>
          <h1 className={"fw-normal"}>{t("404.title")}</h1>
        </Col>
        <Col xs={12}>
          <Card>
            <Card.Body className={"text-center"}>
              {message}
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}

const DummyFunction = () => {
  const { t } = useTranslation("error")
  //tell translation interface that we need these
  t("404.noServer")
  t("404.noWorld")
  t("404.allyNotFound")
  t("404.playerNotFound")
  t("404.villageNotFound")
  t("404.unknownType")
}