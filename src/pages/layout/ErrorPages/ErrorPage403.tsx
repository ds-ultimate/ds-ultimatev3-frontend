import {AxiosError} from "axios";
import {useTranslation} from "react-i18next";
import {Card, Col, Row} from "react-bootstrap";
import {extractMessage} from "./ErrorTypes";


export default function ErrorPage403({error}: {error: AxiosError}) {
  const { t } = useTranslation("error")
  //TODO log 403 at ? (create a concept for monitoring errors)

  let message = extractMessage(t("403.generic"), error, t)
  return (
      <Row className={"justify-content-center p-3"}>
        <Col xs={12} className={"p-lg-5 mx-auto my-1 text-center"}>
          <h1 className={"fw-normal"}>404 {t("403.title")}</h1>
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

/*const DummyFunction = () => {
  const {t} = useTranslation("error")
  //tell translation interface that we need these
  This will be used in the future
}*/