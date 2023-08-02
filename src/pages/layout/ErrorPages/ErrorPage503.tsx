import {AxiosError} from "axios";
import {useTranslation} from "react-i18next";
import {Card, Col, Nav, Row} from "react-bootstrap";
import {extractMessage, FrontendError} from "./ErrorTypes";
import {MatomoLink} from "../../../matomo"
import React from "react"


export default function ErrorPage503({error}: {error: AxiosError | FrontendError}) {
  const { t } = useTranslation("error")

  let message = extractMessage(t("503.generic"), error, t)
  return (
      <Row className={"justify-content-center p-3"}>
        <Col xs={12} className={"p-lg-5 mx-auto my-1 text-center"}>
          <h1 className={"fw-normal"}>{t("503.title")}</h1>
        </Col>
        <Col xs={12}>
          <Card>
            <Card.Body className={"text-center"}>
              {message}
              <MatomoLink as={"a"} params={{href: "https://discord.gg/g3AqvaWhkg"}}>
                Discord
              </MatomoLink>
            </Card.Body>
          </Card>
        </Col>
      </Row>
  )
}

const DummyFunction = () => {
  const {t} = useTranslation("error")
  //tell translation interface that we need these
  t("503.world")
}