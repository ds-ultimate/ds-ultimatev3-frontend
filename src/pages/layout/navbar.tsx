import React, {useEffect, useState} from 'react';

import Dropdown from "./dropdown";
import {getWorldsOfServer} from "../../apiInterface/loadContent";
import {WorldDisplayName, worldType} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import DropdownItem from "./dropdownItem";
import {formatRoute} from "../../util/router";
import {
  INDEX,
  SERVER,
  WORLD,
  WORLD_ALLY_CUR,
  WORLD_ALLY_HIST, WORLD_CONQUER, WORLD_CONQUER_DAILY,
  WORLD_PLAYER_CUR,
  WORLD_PLAYER_HIST
} from "../../util/routes";
import DropdownItemEvent from "./dropdownItemEvent";

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
      getWorldsOfServer(serverCode)
          .then(data => {
            if(mounted) {
              const typeSort = (w1: worldType) => (w1.sortType === "world"?1:0)
              setServerWorlds(data.worlds
                  .filter(d => d.active != null)
                  .sort((w1, w2) => typeSort(w2) - typeSort(w1))
              )
            }
          })
    }
    return () => {
      mounted = false
    }
  }, [serverCode])

  const allMenu: Array<JSX.Element> = []
  allMenu.push(<DropdownItem key={"toIndex"} to={formatRoute(INDEX)}>DS-Ultimate</DropdownItem>)

  if(serverCode !== undefined) {
    allMenu.push(
        <DropdownItem key={"toOverview"} to={formatRoute(SERVER, {server: serverCode})}>
          {t('title.worldOverview')}
        </DropdownItem>
    )

    //TODO switch base path if we are inside a tool / ...
    let basePath = WORLD
    const serverWorldsNav = serverWorlds.map(w => {
      return (
          <DropdownItem key={"serverWorldsNav_" + w.server__code + w.name} to={formatRoute(basePath, {server: w.server__code, world: w.name})}>
            <WorldDisplayName world={w} />
          </DropdownItem>
      )
    })

    allMenu.push(<Dropdown key={"serverWorldsDropdown"} root={<div>{t("server.worlds")}</div>} hover={true}>
      {serverWorldsNav}
    </Dropdown>)
  }
  if(worldName !== undefined) {
    allMenu.push(
        <Dropdown key={"worldRankingsDropdown"} root={<div>{t("server.ranking")}</div>} hover={true}>
          <DropdownItem key={"worldTop10"} to={formatRoute(WORLD, {server: serverCode, world: worldName})}>
            {t('server.ranking')}
          </DropdownItem>
          <DropdownItem key={"worldTablePlayerCur"} to={formatRoute(WORLD_PLAYER_CUR, {server: serverCode, world: worldName})}>
            {t('table.player')} ({t('nav.current')})
          </DropdownItem>
          <DropdownItem key={"worldTablePlayerHist"} to={formatRoute(WORLD_PLAYER_HIST, {server: serverCode, world: worldName})}>
            {t('table.player')} ({t('nav.history')})
          </DropdownItem>
          <DropdownItem key={"worldTableAllyCur"} to={formatRoute(WORLD_ALLY_CUR, {server: serverCode, world: worldName})}>
            {t('table.ally')} ({t('nav.current')})
          </DropdownItem>
          <DropdownItem key={"worldTableAllyHist"} to={formatRoute(WORLD_ALLY_HIST, {server: serverCode, world: worldName})}>
            {t('table.ally')} ({t('nav.history')})
          </DropdownItem>
        </Dropdown>
    )
    allMenu.push(
        <Dropdown key={"worldConquerDropdown"} root={<div>{t("conquer.all")}</div>} hover={true}>
          <DropdownItem key={"worldConquerAll"} to={formatRoute(WORLD_CONQUER, {server: serverCode, world: worldName, type: "all"})}>
            {t('conquer.all')}
          </DropdownItem>
          <DropdownItem key={"worldConquerDaily"} to={formatRoute(WORLD_CONQUER_DAILY, {server: serverCode, world: worldName})}>
            {t('conquer.daily')}
          </DropdownItem>
        </Dropdown>
    )
  }
  allMenu.push(<Dropdown key={"toolDropdown"} root={<div>{t("server.tools")}</div>} hover={true}>
    <DropdownItem key={"TODO"} to={"#"} disabled>TODO</DropdownItem>
  </Dropdown>)

  allMenu.push(<Dropdown key={"langDropdown"} root={<div>{t("language")}</div>} hover={true}>
    <DropdownItemEvent key={"de"} onclick={() => i18n.changeLanguage('de')}>de</DropdownItemEvent>
    <DropdownItemEvent key={"en"} onclick={() => i18n.changeLanguage('en')}>en</DropdownItemEvent>
  </Dropdown>)

  return (
      <nav>
        {allMenu}
      </nav>
  )
}
