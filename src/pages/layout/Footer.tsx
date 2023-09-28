import {Nav, NavItem} from "react-bootstrap";
import React, {Key, useContext} from "react";
import {Link} from "react-router-dom";
import {formatRoute} from "../../util/router";
import {CHANGELOG_PAGE, LEGAL_PAGE, TEAM_PAGE} from "../routes";
import {useTranslation} from "react-i18next";
import {ResetCookieConsentContext} from "./CookieConsent"
import {MatomoLink} from "../../matomo"


export default function Footer() {
  const { t } = useTranslation("ui")
  const resetCookieConsent = useContext(ResetCookieConsentContext)

  const data: Array<[Key, string, string]> = [
    ["l", LEGAL_PAGE, t("footer.legalPage")],
    ["c", CHANGELOG_PAGE, t("footer.changelog")],
    ["t", TEAM_PAGE, t("footer.team")],
  ]

  return (
    <Nav className={"footer-bg footer-nav"}>
      <Nav.Item>
        <Nav.Link as={"button"} onClick={resetCookieConsent}>
          <small>{t("footer.cookie")}</small>
        </Nav.Link>
      </Nav.Item>
      {data.map(d => <React.Fragment key={d[0]}>
        <Nav.Item>
          <Nav.Link as={Link} to={formatRoute(d[1], {})}>
            <small>{d[2]}</small>
          </Nav.Link>
        </Nav.Item>
        <NavItem><small className={"nav-link"}>-</small></NavItem>
      </React.Fragment>)}
      <Nav.Item>
        <MatomoLink as={Nav.Link} params={{as: "a", href: "https://discord.gg/g3AqvaWhkg"}}>
          <small>Discord</small>
        </MatomoLink>
      </Nav.Item>
    </Nav>
  )
}
