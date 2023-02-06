'use client';
import React, {useEffect, useState} from "react";
import DropdownItem from "@/app/(main_app)/dropdownItem";
import Dropdown from "@/app/(main_app)/dropdown";
import {useTranslation} from "next-i18next";
import {WorldDisplayName, worldType} from "@/modelHelper/World";
import {getWorldsOfServer} from "@/apiInterface/loadContent";
import {
  INDEX,
  SERVER,
  WORLD,
  WORLD_ALLY_CUR,
  WORLD_ALLY_HIST, WORLD_CONQUER, WORLD_CONQUER_DAILY,
  WORLD_PLAYER_CUR,
  WORLD_PLAYER_HIST
} from "@/util/routes";
import {formatRoute} from "@/util/router";

export default function NavbarClient({serverCode, worldName, children}: {serverCode?: string, worldName?: string, children: JSX.Element}) {
  const [serverWorlds, setServerWorlds] = useState<worldType[]>([])
  const { t } = useTranslation("ui")

  useEffect(() => {
    let mounted = true
    if(serverCode === undefined) {
      setServerWorlds([])
    } else {
      getWorldsOfServer(serverCode)
          .then(data => {
            if(mounted) {
              const typeSort = (w1: worldType) => (w1.sortType === "world"?1:0)
              setServerWorlds(data
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
  //TODO switch base path if we are inside a tool / ...
  let basePath = WORLD

  const serverWorldsNav = serverWorlds.map(w => {
    return (
        <DropdownItem key={"serverWorldsNav_" + w.server + w.name} to={formatRoute(basePath, {server: w.server, world: w.name})}>
          {WorldDisplayName(w)}
        </DropdownItem>
    )
  })

  allMenu.push(<DropdownItem key={"toIndex"} to={formatRoute(INDEX)}>DS-Ultimate</DropdownItem>)
  if(serverCode !== undefined) {
    allMenu.push(
        <DropdownItem key={"toOverview"} to={formatRoute(SERVER, {server: serverCode})}>
          {t('title.worldOverview')}
        </DropdownItem>
    )
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

  allMenu.push(
      <Dropdown key={"langDropdown"} root={<div>{("language")}</div>} hover={true}>
        {children}
      </Dropdown>
  )

  return (
      <nav>
        {allMenu}
      </nav>
  )
}