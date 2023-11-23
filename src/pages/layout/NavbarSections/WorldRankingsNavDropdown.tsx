import {useTranslation} from "react-i18next"
import {formatRoute} from "../../../util/router"
import {WORLD, WORLD_ALLY_CUR, WORLD_ALLY_HIST, WORLD_PLAYER_CUR, WORLD_PLAYER_HIST} from "../../routes"
import {faRankingStar, faUser, faUsers} from "@fortawesome/free-solid-svg-icons"
import React from "react"
import {NavbarItem, NavbarMenu} from "../Navbar"


export function WorldRankingsNavDropdown({serverCode, worldName}: {serverCode: string | undefined, worldName: string | undefined}) {
  const { t } = useTranslation("ui")

  if(serverCode === undefined || worldName === undefined) {
    return null
  }

  return (
      <NavbarMenu
          keyName={"worldRankingsDropdown"}
          title={t("server.ranking")}
          sub={[
            <NavbarItem key={"worldTop10"}
                        to={formatRoute(WORLD, {server: serverCode, world: worldName})}
                        text={t('server.ranking')}
                        icon={faRankingStar} />,
            <NavbarItem key={"worldTablePlayerCur"}
                        to={formatRoute(WORLD_PLAYER_CUR, {server: serverCode, world: worldName})}
                        text={t('table.player') + " (" + t('nav.current')  + ")"}
                        icon={faUser} />,
            <NavbarItem key={"worldTablePlayerHist"}
                        to={formatRoute(WORLD_PLAYER_HIST, {server: serverCode, world: worldName})}
                        text={t('table.player') + " (" + t('nav.history')  + ")"}
                        icon={faUser} />,
            <NavbarItem key={"worldTableAllyCur"}
                        to={formatRoute(WORLD_ALLY_CUR, {server: serverCode, world: worldName})}
                        text={t('table.ally') + " (" + t('nav.current')  + ")"}
                        icon={faUsers} />,
            <NavbarItem key={"worldTableAllyHist"}
                        to={formatRoute(WORLD_ALLY_HIST, {server: serverCode, world: worldName})}
                        text={t('table.ally') + " (" + t('nav.history')  + ")"}
                        icon={faUsers} />,
          ]}
          icon={faRankingStar}
      />
  )
}
