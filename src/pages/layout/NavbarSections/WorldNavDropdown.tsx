import {worldDisplayNameRaw, worldType} from "../../../modelHelper/World"
import {useTranslation} from "react-i18next"
import {WORLD} from "../../routes"
import {formatRoute} from "../../../util/router"
import {faServer} from "@fortawesome/free-solid-svg-icons"
import React from "react"
import {NavbarItem, NavbarMenu} from "../Navbar"


export function WorldNavDropdown({serverCode, sortedWorlds}: {serverCode: string | undefined, sortedWorlds: worldType[]}) {
  const { t } = useTranslation("ui")

  if(serverCode === undefined) {
    return null
  }

  //TODO switch base path if we are inside a tool / ...
  let basePath = WORLD
  const serverWorldsNav = sortedWorlds.map(w => {
    return (
        <NavbarItem
            key={"serverWorldsNav_" + w.server__code + w.name}
            to={formatRoute(basePath, {server: w.server__code, world: w.name})}
            text={worldDisplayNameRaw(t, w)}
            icon={faServer}
        />
    )
  })

  return (
      <NavbarMenu
          keyName={"serverWorldsDropdown"}
          title={t("server.worlds")}
          sub={serverWorldsNav}
          icon={faServer}
      />
  )
}
