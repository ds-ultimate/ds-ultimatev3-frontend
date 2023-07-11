import {Nav, NavItem} from "react-bootstrap";
import React, {Key} from "react";
import {Link} from "react-router-dom";
import {formatRoute} from "../../util/router";
import {BUGREPORT_PAGE, CHANGELOG_PAGE, LEGAL_PAGE, TEAM_PAGE} from "../../util/routes";
import {useTranslation} from "react-i18next";


export default function Footer() {
  const [t, i18n] = useTranslation("ui")

  const data: Array<[Key, string, string]> = [
    ["l", LEGAL_PAGE, t("legalPage")],
    ["c", CHANGELOG_PAGE, t("changelog")],
    ["t", TEAM_PAGE, t("team")],
    ["b", BUGREPORT_PAGE, t("bugreport")],
  ]

  return (
    <Nav className={"footer-bg footer-nav"}>
      {data.map(d => <React.Fragment key={d[0]}>
        <Nav.Item>
          <Nav.Link as={Link} to={formatRoute(d[1], {})}>
            <small>{d[2]}</small>
          </Nav.Link>
        </Nav.Item>
        <NavItem><small className={"nav-link"}>-</small></NavItem>
      </React.Fragment>)}
      <Nav.Item>
        <Nav.Link as={"a"} href={"https://discord.gg/g3AqvaWhkg"}>
          <small>Discord</small>
        </Nav.Link>
      </Nav.Item>
    </Nav>
  )
}
