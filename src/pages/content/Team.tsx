import React, {Key, useEffect} from "react";
import {Col, Row} from "react-bootstrap";
import {useTranslation} from "react-i18next";
import styles from "./Team.module.scss"

import bg_nehoz from "./team/background/system.jpg"
import bg_mkich from "./team/background/dev.jpg"
import bg_skatecram from "./team/background/dev1.jpg"

import avatar_nehoz from "./team/avatar/sebastian.jpg"
import avatar_mkich from "./team/avatar/michael.png"
import avatar_skatecram from "./team/avatar/marc.png"
import {AT, CH, DE, FlagComponent} from "country-flag-icons/react/3x2";

export default function TeamPage() {
  const { t } = useTranslation("ui")

  useEffect(() => {
    document.title = "DS-Ultimate"
  }, [])

  const cardData: Array<{
    k: Key
    bg: string
    avatar: string
    name: string
    function: string
    flag: FlagComponent
  }> = [
    {k: "nehoz", bg: bg_nehoz, avatar: avatar_nehoz, name: "Sebastian 'Nehoz'", function: "Systemadministrator (Funder)", flag: DE},
    {k: "mkich", bg: bg_mkich, avatar: avatar_mkich, name: "Michael 'MKich'", function: "Front-/Back-end Developer (v1 / v2 / v3)", flag: AT},
    {k: "skatecram", bg: bg_skatecram, avatar: avatar_skatecram, name: "Marc 'skatecram'", function: "Front-/Back-end Developer (v2)", flag: CH},
  ]

  return (
      <Row className={"justify-content-center"}>
        <Col xs={12} className={"m-5"}>
          <h2 className={"text-center fw-bold mb-5"}>{t("team.header")}</h2>
          <p className={"text-center mx-auto mb-5"}>
            {t("team.subheader")}
          </p>
          <Row>
            {cardData.map(d => (
                <Col xs={12} lg={6} xl={4} key={d.k} className={"mb-4"}>
                  <div className={styles.cardTeam}>
                    <img className={styles.cardImgTop} src={d.bg} alt={"background"} />
                    <div className={styles.avatar + " mx-auto"}>
                      <img className={"rounded-circle img-fluid"} src={d.avatar} alt={"avatar"} />
                    </div>
                    <div className={styles.description}>
                      <h4 className={"fw-bold mt-1 mb-3"}>{d.name}</h4>
                      <p className={"fw-bold h5 mb-4"}>{d.function}</p>
                      <d.flag className={styles.flags + " rounded"} />
                    </div>
                  </div>
                </Col>
            ))}
            <Col xs={12} lg={6} xl={4} className={"mb-4"}>
              <div className={styles.cardTeam}>
                <div className={styles.description}>
                  <h4 className={"fw-bold mt-4 mb-4"}>{t("team.specialThanks")}</h4>
                  <p className={"h5 mb-4"}><b>Jonas 'EchtkPvL'</b> (Systemadministrator) <DE className={styles.flags + " rounded"} /> </p>
                  <p className={"h5 mb-4"}><b>Dominik 'Valerius2101'</b> <DE className={styles.flags + " rounded"} /> </p>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
  )
}
