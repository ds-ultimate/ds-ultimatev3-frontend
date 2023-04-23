import React, {useEffect, useState} from 'react';

import {CZ, DE, GB} from 'country-flag-icons/react/3x2'
import {getWorldsOfServer} from "../../apiInterface/loadContent";
import {WorldDisplayName, worldType} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import {formatRoute} from "../../util/router";
import {Button, Dropdown, Form, Nav, Navbar as ReactNav, NavDropdown} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {
  INDEX,
  SERVER,
  WORLD,
  WORLD_ALLY_CUR,
  WORLD_ALLY_HIST,
  WORLD_CONQUER,
  WORLD_CONQUER_DAILY,
  WORLD_PLAYER_CUR,
  WORLD_PLAYER_HIST
} from "../../util/routes";
import {THEME, useGetCurrentTheme, useSetTheme} from "./theme";

/*

$tools = [];
if($worldArg !== null) {
  if($worldArg->win_condition == 9) {
    $tools[] = self::navElement('tool.greatSiegeCalc.title', 'tools.greatSiegeCalc', routeArgs: $serverCodeName);
  }
  if($worldArg->config != null && $worldArg->units != null) {
    $tools[] = self::navElement('tool.distCalc.title', 'tools.distanceCalc', routeArgs: $serverCodeName);
    $tools[] = self::navElement('tool.attackPlanner.title', 'tools.attackPlannerNew', routeArgs: $serverCodeName, nofollow: true);
  } else {
    $tools[] = self::navElementDisabled('tool.distCalc.title', 'ui.nav.disabled.missingConfig');
    $tools[] = self::navElementDisabled('tool.attackPlanner.title', 'ui.nav.disabled.missingConfig');
  }
  $tools[] = self::navElement('tool.map.title', 'tools.mapNew', routeArgs: $serverCodeName, nofollow: true);

  if($worldArg->config != null && $worldArg->buildings != null) {
    $tools[] = self::navElement('tool.pointCalc.title', 'tools.pointCalc', routeArgs: $serverCodeName);
  } else {
    $tools[] = self::navElementDisabled('tool.pointCalc.title', 'ui.nav.disabled.missingConfig');
  }
  $tools[] = self::navElement('tool.tableGenerator.title', 'tools.tableGenerator', routeArgs: $serverCodeName);

  if($worldArg->config != null && $worldArg->units != null) {
    $tools[] = self::navElement('tool.accMgrDB.title', 'tools.accMgrDB.index_world', routeArgs: $serverCodeName);
  } else {
    $tools[] = self::navElementDisabled('tool.accMgrDB.title', 'ui.nav.disabled.missingConfig');
  }

  if(AnimatedHistoryMapController::isAvailable($worldArg)) {
    $tools[] = self::navElement('tool.animHistMap.title', 'tools.animHistMap.create', routeArgs: $serverCodeName, nofollow: true);
  } else {
    $tools[] = self::navElementDisabled('tool.animHistMap.title', 'ui.nav.disabled.missingConfig');
  }
} else {
  $tools[] = self::navElementDisabled('tool.distCalc.title', 'ui.nav.disabled.noWorld');
  $tools[] = self::navElementDisabled('tool.attackPlanner.title', 'ui.nav.disabled.noWorld');
  $tools[] = self::navElementDisabled('tool.map.title', 'ui.nav.disabled.noWorld');
  $tools[] = self::navElementDisabled('tool.pointCalc.title', 'ui.nav.disabled.noWorld');
  $tools[] = self::navElementDisabled('tool.tableGenerator.title', 'ui.nav.disabled.noWorld');
  $tools[] = self::navElement('tool.accMgrDB.title', 'tools.accMgrDB.index');

  $tools[] = self::navElementDisabled('tool.animHistMap.title', 'ui.nav.disabled.noWorld');
}
$retArray[] = self::navDropdown(title: 'ui.server.tools', subElements: $tools);
 */

export default function Navbar({serverCode, worldName}: {serverCode?: string, worldName?: string}) {
  const [serverWorlds, setServerWorlds] = useState<worldType[]>([])
  const [t, i18n] = useTranslation("ui")

  useEffect(() => {
    let mounted = true
    if(serverCode === undefined) {
      setServerWorlds([])
    } else {
      getWorldsOfServer({server: serverCode})
          .then(data => {
            if(mounted) {
              if(data === undefined) {
                //server not found has to be handled by main page
                setServerWorlds([])
              } else {
                const typeSort = (w1: worldType) => (w1.sortType === "world"?1:0)
                setServerWorlds(data.worlds
                    .filter(d => d.active != null)
                    .sort((w1, w2) => typeSort(w2) - typeSort(w1))
                )
              }
            }
          })
          .catch(() => {
            //ignore here more or less since this has to be handled by the main page
            if(mounted) {
              setServerWorlds([])
            }
          })
    }
    return () => {
      mounted = false
    }
  }, [serverCode])

  const allMenu: Array<JSX.Element> = []

  if(serverCode !== undefined) {
    allMenu.push(
        <Nav.Item key={"toOverview"}>
          <Nav.Link as={Link} to={formatRoute(SERVER, {server: serverCode})}>
            {t('title.worldOverview')}
          </Nav.Link>
        </Nav.Item>
    )

    //TODO switch base path if we are inside a tool / ...
    let basePath = WORLD
    const serverWorldsNav = serverWorlds.map(w => {
      return (
          <NavDropdown.Item
              key={"serverWorldsNav_" + w.server__code + w.name}
              as={Link}
              to={formatRoute(basePath, {server: w.server__code, world: w.name})}>
            <WorldDisplayName world={w} />
          </NavDropdown.Item>
      )
    })

    allMenu.push(
        <NavDropdown
            key={"serverWorldsDropdown"}
            title={t("server.worlds")}>
          {serverWorldsNav}
        </NavDropdown>
    )
  }

  if(worldName !== undefined) {
    allMenu.push(
        <NavDropdown
            key={"worldRankingsDropdown"}
            title={t("server.ranking")}>
          <NavDropdown.Item key={"worldTop10"} as={Link} to={formatRoute(WORLD, {server: serverCode, world: worldName})}>
            {t('server.ranking')}
          </NavDropdown.Item>
          <NavDropdown.Item key={"worldTablePlayerCur"} as={Link} to={formatRoute(WORLD_PLAYER_CUR, {server: serverCode, world: worldName})}>
            {t('table.player')} ({t('nav.current')})
          </NavDropdown.Item>
          <NavDropdown.Item key={"worldTablePlayerHist"} as={Link} to={formatRoute(WORLD_PLAYER_HIST, {server: serverCode, world: worldName})}>
            {t('table.player')} ({t('nav.history')})
          </NavDropdown.Item>
          <NavDropdown.Item key={"worldTableAllyCur"} as={Link} to={formatRoute(WORLD_ALLY_CUR, {server: serverCode, world: worldName})}>
            {t('table.ally')} ({t('nav.current')})
          </NavDropdown.Item>
          <NavDropdown.Item key={"worldTableAllyHist"} as={Link} to={formatRoute(WORLD_ALLY_HIST, {server: serverCode, world: worldName})}>
            {t('table.ally')} ({t('nav.history')})
          </NavDropdown.Item>
        </NavDropdown>
    )
    allMenu.push(
        <NavDropdown
            key={"worldConquerDropdown"}
            title={t("conquer.all")}>
          <NavDropdown.Item key={"worldConquerAll"} as={Link} to={formatRoute(WORLD_CONQUER, {server: serverCode, world: worldName, type: "all"})}>
            {t('conquer.all')}
          </NavDropdown.Item>
          <NavDropdown.Item key={"worldConquerDaily"} as={Link} to={formatRoute(WORLD_CONQUER_DAILY, {server: serverCode, world: worldName})}>
            {t('conquer.daily')}
          </NavDropdown.Item>
        </NavDropdown>
    )
  }
  allMenu.push(
      <NavDropdown key={"toolDropdown"} title={t("server.tools")}>
        <NavDropdown.Item key={"TODO"} as={Link} to={"#"} disabled>TODO</NavDropdown.Item>
      </NavDropdown>
  )

  const getCurrentTheme = useGetCurrentTheme()
  const setTheme = useSetTheme()
  let props: [string, string, string]
  if(getCurrentTheme() === THEME.LIGHT) {
    props = ["outline-dark", THEME.DARK, t('darkMode')]
  } else {
    props = ["outline-light", THEME.LIGHT, t('lightMode')]
  }
  allMenu.push(
      <Nav.Item key={"darkModeToggle"} className="ms-lg-auto">
        <Nav.Link className={"d-lg-none"} onClick={() => setTheme(props[1])}>{props[2]}</Nav.Link>
        <Button className={"d-none d-lg-inline-block"} variant={props[0]} onClick={() => setTheme(props[1])}>{props[2]}</Button>
      </Nav.Item>//btn btn-${props[0]}
  )

  if(serverCode) {
    allMenu.push(
        <Form className="d-flex ms-lg-2" key={"search"}>
          <Form.Control
              type="search"
              placeholder={t('title.search') ?? undefined}
              className="me-2"
              aria-label="Search"
          />
          <Button variant={(getCurrentTheme() === THEME.LIGHT)?"outline-dark":"outline-primary"}>{t('title.search')}</Button>
        </Form>
    )
    //TODO: implement search
    //TODO: mobile search
  }

  const selectLang = function(eventData: string | null) {
    if(eventData)
      i18n.changeLanguage(eventData)
  }

  const langItems = (
      <>
        <Dropdown.Item eventKey={'de'}><DE className={"flags"}/>Deutsch</Dropdown.Item>
        <Dropdown.Item eventKey={'en'}><GB className={"flags"}/>English</Dropdown.Item>
        <Dropdown.Item eventKey={'cs'}><CZ className={"flags"}/>Czech</Dropdown.Item>
      </>
  )
  allMenu.push(
      <div key={"langDropdown-lg"} className={"d-none d-lg-inline"}>
        <Dropdown className={"ms-2"} onSelect={selectLang}>
          <Dropdown.Toggle variant={(getCurrentTheme() === THEME.LIGHT)?"outline-dark":"outline-primary"}>
            {t("language")}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {langItems}
          </Dropdown.Menu>
        </Dropdown>
      </div>
  )
  allMenu.push(
      <div key={"langDropdown-mobile"} className={"d-lg-none"}>
        <NavDropdown onSelect={selectLang} title={t("language")}>
          {langItems}
        </NavDropdown>
      </div>
  )

  //TODO: add login + user area here

  return (
      <ReactNav className={"nav-bg"} expand={"lg"}>
        <ReactNav.Brand key={"toIndex"} as={Link} to={formatRoute(INDEX)}>DS-Ultimate</ReactNav.Brand>
        <ReactNav.Toggle aria-controls="navbarScroll" />
        <ReactNav.Collapse id={"navbarScroll"}>
          <Nav className={"w-100"}>
            {allMenu}
          </Nav>
        </ReactNav.Collapse>
      </ReactNav>
  )
}