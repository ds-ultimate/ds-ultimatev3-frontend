import {AxiosError} from "axios";
import {useTranslation} from "react-i18next";
import {Card, Col, Row} from "react-bootstrap";
import {extractMessage, FrontendError} from "./ErrorTypes";


export default function ErrorPage500({error}: {error: AxiosError | FrontendError}) {
  const { t } = useTranslation("error")

  let message = extractMessage(t("500.generic"), error, t)
  return (
      <Row className={"justify-content-center p-3"}>
        <Col xs={12} className={"p-lg-5 mx-auto my-1 text-center"}>
          <h1 className={"fw-normal"}>500 {t("500.title")}</h1>
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
  This might be used in the future (unsure if we will ever get usable errors from a 500)
}*/