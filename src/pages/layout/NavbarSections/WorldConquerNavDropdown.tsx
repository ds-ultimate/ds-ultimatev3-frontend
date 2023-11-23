import {useTranslation} from "react-i18next"
import {formatRoute} from "../../../util/router"
import {WORLD_CONQUER, WORLD_CONQUER_DAILY} from "../../routes"
import {faCalendarDays, faCalendarDay} from "@fortawesome/free-solid-svg-icons"
import {faFortAwesome} from "@fortawesome/free-brands-svg-icons"
import React from "react"
import {NavbarItem, NavbarMenu} from "../Navbar"


export function WorldConquerNavDropdown({serverCode, worldName}: {serverCode: string | undefined, worldName: string | undefined}) {
  const { t } = useTranslation("ui")

  if(serverCode === undefined || worldName === undefined) {
    return null
  }

  return (
      <NavbarMenu
          keyName={"worldConquerDropdown"}
          title={t("conquer.all")}
          sub={[
            <NavbarItem key={"worldConquerAll"}
                        to={formatRoute(WORLD_CONQUER, {server: serverCode, world: worldName, type: "all"})}
                        text={t('conquer.all')}
                        icon={faCalendarDays} />,
            <NavbarItem key={"worldConquerDaily"}
                        to={formatRoute(WORLD_CONQUER_DAILY, {server: serverCode, world: worldName})}
                        text={t('conquer.daily')}
                        icon={faCalendarDay} />,
          ]}
          icon={faFortAwesome}
      />
  )
}
