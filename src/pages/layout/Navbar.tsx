import React, {useMemo, useState} from 'react';

import {CZ, DE, GB} from 'country-flag-icons/react/3x2'
import {WorldActiveMode, WorldDisplayName, worldType} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import {formatRoute} from "../../util/router";
import {Button, Dropdown, Form, Nav, Navbar as ReactNav, NavDropdown} from 'react-bootstrap';
import {Link, useNavigate} from "react-router-dom";
import {
  INDEX,
  SEARCH,
  SERVER,
  WORLD,
  WORLD_ALLY_CUR,
  WORLD_ALLY_HIST,
  WORLD_CONQUER,
  WORLD_CONQUER_DAILY,
  WORLD_PLAYER_CUR,
  WORLD_PLAYER_HIST
} from "../routes";
import {THEME, useGetCurrentTheme, useSetTheme} from "./theme";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUser, faUsers} from "@fortawesome/free-solid-svg-icons"
import {faFortAwesome} from "@fortawesome/free-brands-svg-icons"
import {useWorldsOfServer} from "../../apiInterface/loaders/world"
import ErrorPage from "./ErrorPage"
import {DISTANCE_CALC, POINT_CALC} from "../tools/routes"


export default function Navbar({serverCode, worldName}: {serverCode?: string, worldName?: string}) {
  const [serverWorldsErr, serverWorlds] = useWorldsOfServer(serverCode)
  const [tTool] = useTranslation("tool")
  const [t, i18n] = useTranslation("ui")
  const navigate = useNavigate()
  const [searchContents, setSearchContents] = useState<string>("")
  const [navbarExpanded, setNavbarExpanded] = useState<boolean>(false)

  const sortedWorlds = useMemo(() => {
    if(serverWorlds === undefined) {
      return []
    }
    const typeSort = (w1: worldType) => (w1.sortType === "world"?1:0)
    return serverWorlds
        .filter(d => d.active !== WorldActiveMode.INACTIVE)
        .sort((w1, w2) => typeSort(w2) - typeSort(w1))
  }, [serverWorlds])

  const currentWorld = useMemo(() => {
    if(serverCode === undefined || worldName === undefined || serverWorlds === undefined) {
      return undefined
    }

    return serverWorlds.find(w => w.server__code === serverCode && w.name === worldName)
  }, [serverCode, worldName, serverWorlds])

  const allMenu: Array<React.ReactNode> = []

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
    const serverWorldsNav = sortedWorlds.map(w => {
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

  const toolEntries: React.ReactElement[] = []
  if(currentWorld !== undefined) {
    //TODO create generator function for disabled nav elements
    /* //TODO add this/these tool(s)
    if($worldArg->win_condition == 9) {
      $tools[] = self::navElement('tool.greatSiegeCalc.title', 'tools.greatSiegeCalc', routeArgs: $serverCodeName);
    }
     */
    if(currentWorld.hasConfig && currentWorld.hasUnits) {
      toolEntries.push(<NavDropdown.Item key={"dstClc"} as={Link} to={formatRoute(DISTANCE_CALC, {server: serverCode, world: worldName})}>
        {tTool("distCalc.title")}
      </NavDropdown.Item>)
    }
    /* //TODO add this/these tool(s)
    if($worldArg->config != null && $worldArg->units != null) {
      $tools[] = self::navElement('tool.attackPlanner.title', 'tools.attackPlannerNew', routeArgs: $serverCodeName, nofollow: true);
    } else {
      $tools[] = self::navElementDisabled('tool.distCalc.title', 'ui.nav.disabled.missingConfig');
      $tools[] = self::navElementDisabled('tool.attackPlanner.title', 'ui.nav.disabled.missingConfig');
    }
    $tools[] = self::navElement('tool.map.title', 'tools.mapNew', routeArgs: $serverCodeName, nofollow: true);
    */

    if(currentWorld.hasConfig && currentWorld.hasUnits) {
      toolEntries.push(<NavDropdown.Item key={"pntClc"} as={Link} to={formatRoute(POINT_CALC, {server: serverCode, world: worldName})}>
        {tTool("pointCalc.title")}
      </NavDropdown.Item>)
    }
    /* //TODO add this/these tool(s)
    if($worldArg->config != null && $worldArg->buildings != null) {
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
     */
  } else {
    /* //TODO add this/these tool(s)
    $tools[] = self::navElementDisabled('tool.distCalc.title', 'ui.nav.disabled.noWorld');
    $tools[] = self::navElementDisabled('tool.attackPlanner.title', 'ui.nav.disabled.noWorld');
    $tools[] = self::navElementDisabled('tool.map.title', 'ui.nav.disabled.noWorld');
    $tools[] = self::navElementDisabled('tool.pointCalc.title', 'ui.nav.disabled.noWorld');
    $tools[] = self::navElementDisabled('tool.tableGenerator.title', 'ui.nav.disabled.noWorld');
    $tools[] = self::navElement('tool.accMgrDB.title', 'tools.accMgrDB.index');

    $tools[] = self::navElementDisabled('tool.animHistMap.title', 'ui.nav.disabled.noWorld');
     */
  }

  allMenu.push(
      <NavDropdown key={"toolDropdown"} title={t("server.tools")}>
        {toolEntries}
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
        <Form className="d-flex ms-lg-2" key={"search"} onSubmit={evt => {
          evt.preventDefault()
          setNavbarExpanded(false)
          navigate(formatRoute(SEARCH, {server: serverCode, type: "player", search: searchContents}))
        }}>
          <Form.Control
              type="search"
              placeholder={t('title.search') ?? undefined}
              className="me-2"
              aria-label="Search"
              value={searchContents}
              onChange={evt => setSearchContents(evt.target.value)}
          />
          <Dropdown>
            <Dropdown.Toggle variant={(getCurrentTheme() === THEME.LIGHT)?"outline-dark":"outline-light"}>
              {t('title.search')}
            </Dropdown.Toggle>

            {/* dropdown-menu-xl-right */}
            <Dropdown.Menu>
              <Dropdown.Item as={Button} onClick={() => {
                setNavbarExpanded(false)
                navigate(formatRoute(SEARCH, {server: serverCode, type: "player", search: searchContents}))}
              }>
                <FontAwesomeIcon icon={faUser} /> {t("table.player")}
              </Dropdown.Item>
              <Dropdown.Item as={Button} onClick={() => {
                setNavbarExpanded(false)
                navigate(formatRoute(SEARCH, {server: serverCode, type: "ally", search: searchContents}))}
              }>
                <FontAwesomeIcon icon={faUsers} /> {t("table.ally")}
              </Dropdown.Item>
                <Dropdown.Item as={Button} onClick={() => {
                  setNavbarExpanded(false)
                  navigate(formatRoute(SEARCH, {server: serverCode, type: "village", search: searchContents}))}
                }>
                <FontAwesomeIcon icon={faFortAwesome} /> {t("table.village")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form>
    )
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
          <Dropdown.Toggle variant={(getCurrentTheme() === THEME.LIGHT)?"outline-dark":"outline-light"}>
            {t("language")}
          </Dropdown.Toggle>
          <Dropdown.Menu className={"dropdown-menu-end"}>
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

  if(serverWorldsErr) return <ErrorPage error={serverWorldsErr} />

  return (
      <ReactNav className={"nav-bg"} expand={"lg"} expanded={navbarExpanded}>
        <ReactNav.Brand key={"toIndex"} as={Link} to={formatRoute(INDEX)}>DS-Ultimate</ReactNav.Brand>
        <ReactNav.Toggle aria-controls="navbarScroll" onClick={() => setNavbarExpanded(old => !old)}/>
        <ReactNav.Collapse id={"navbarScroll"}>
          <Nav className={"w-100"}>
            {allMenu}
          </Nav>
        </ReactNav.Collapse>
      </ReactNav>
  )
}
