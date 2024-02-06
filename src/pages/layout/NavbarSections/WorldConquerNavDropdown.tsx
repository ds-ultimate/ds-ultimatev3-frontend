import {useTranslation} from "react-i18next"
import {formatRoute} from "../../../util/router"
import {WORLD_CONQUER, WORLD_CONQUER_DAILY} from "../../routes"
import {faCalendarDays, faCalendarDay} from "@fortawesome/free-solid-svg-icons"
import {faFortAwesome} from "@fortawesome/free-brands-svg-icons"
import React from "react"
import {NavbarItem, NavbarMenu} from "../Navbar"
import {useExtendedWorldData} from "../../../apiInterface/loaders/world"


export function WorldConquerNavDropdown({serverCode, worldName}: {serverCode: string | undefined, worldName: string | undefined}) {
  const { t } = useTranslation("ui")
  const [worldExtErr, extendedWorldData] = useExtendedWorldData(serverCode, worldName)

  if(serverCode === undefined || worldName === undefined) {
    return null
  }
  if(worldExtErr) return null

  let subNav = [
    <NavbarItem key={"worldConquerAll"}
                to={formatRoute(WORLD_CONQUER, {server: serverCode, world: worldName, type: "all"})}
                text={t('conquer.all')}
                icon={faCalendarDays} />,
  ]
  if(extendedWorldData?.firstConquer !== null && extendedWorldData?.firstConquer !== undefined) {
    subNav.push(<NavbarItem key={"worldConquerDaily"}
                            to={formatRoute(WORLD_CONQUER_DAILY, {server: serverCode, world: worldName})}
                            text={t('conquer.daily')}
                            icon={faCalendarDay} />)
  }

  return (
      <NavbarMenu
          keyName={"worldConquerDropdown"}
          title={t("conquer.all")}
          sub={subNav}
          icon={faFortAwesome}
      />
  )
}
