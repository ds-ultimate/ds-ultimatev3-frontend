import {AxiosError} from "axios";
import {useTranslation} from "react-i18next";
import {Card, Col, Row} from "react-bootstrap";
import {extractMessage, FrontendError} from "./ErrorTypes";


export default function ErrorPage404({error}: {error: AxiosError | FrontendError}) {
  const { t } = useTranslation("error")

  let message = extractMessage(t("404.generic"), error, t)
  return (
      <Row className={"justify-content-center p-3"}>
        <Col xs={12} className={"p-lg-5 mx-auto my-1 text-center"}>
          <h1 className={"fw-normal"}>404 {t("404.title")}</h1>
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const DummyFunction = () => {
  const { t } = useTranslation("error")
  //tell translation interface that we need these
  t("404.noServer")
  t("404.noWorld")
  t("404.noWorldId")
  t("404.allyNotFound")
  t("404.allyDisbanded")
  t("404.playerNotFound")
  t("404.villageNotFound")
  t("404.unknownType")
  t("404.worldNotSupported")
}