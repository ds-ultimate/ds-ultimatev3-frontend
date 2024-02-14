import React, {createContext, Key, MouseEventHandler, ReactNode, useContext, useMemo, useState} from 'react';

import {WorldActiveMode, worldType} from "../../modelHelper/World";
import {useTranslation} from "react-i18next";
import {formatRoute} from "../../util/router";
import {Tooltip} from 'react-bootstrap';
import {Link} from "react-router-dom";
import {
  INDEX,
  SEARCH,
  SERVER,
} from "../routes";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faChevronRight} from "@fortawesome/free-solid-svg-icons"
import {useWorldsOfServer} from "../../apiInterface/loaders/world"
import ErrorPage from "./ErrorPage"
import styles from "./Navbar.module.scss"
import {faChevronLeft, faChevronDown, faServer, faGlobe, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"
import {IconProp} from "@fortawesome/fontawesome-svg-core"
import {WorldNavDropdown} from "./NavbarSections/WorldNavDropdown"
import {WorldRankingsNavDropdown} from "./NavbarSections/WorldRankingsNavDropdown"
import {WorldConquerNavDropdown} from "./NavbarSections/WorldConquerNavDropdown"
import {ToolNavDropdown} from "./NavbarSections/ToolNavDropdown"
import {NavThemeSelector} from "./NavbarSections/NavThemeSelector"
import {NavLangSelector} from "./NavbarSections/NavLangSelector"
import {CustomTooltip} from "../../util/UtilFunctions"
import {useBreakpointDown} from "../../util/bootrapBreakpoints"


const ExtendedSubMenuContext = createContext<[Key | undefined, (k: Key | undefined | ((old: Key | undefined) => Key | undefined)) => void]>([undefined, () => {}])

export default function Navbar({serverCode, worldName}: {serverCode?: string, worldName?: string}) {
  const [serverWorldsErr, serverWorlds] = useWorldsOfServer(serverCode)
  const { t } = useTranslation("ui")
  const [extended, setExtended] = useState<boolean>(true)
  const [extendedSubMenu, setExtendedSubMenu] = useState<Key | undefined>(undefined)
  const showMobileNav = useBreakpointDown("sm")

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

  if(serverWorldsErr) return <ErrorPage error={serverWorldsErr} />
  //TODO: add login + user area

  const mainNavElement = (
      <>
        <Link to={formatRoute(INDEX)} className={styles.navbarBrand}>DS-Ultimate</Link>
        <ul>
          <NavbarItem to={formatRoute(INDEX, {})} text={t('title.serverOverview')} icon={faGlobe}/>
          {serverCode && <NavbarItem to={formatRoute(SERVER, {server: serverCode})}
                                     text={t('title.worldOverview')} icon={faServer}/>}
          <WorldNavDropdown serverCode={serverCode} sortedWorlds={sortedWorlds}/>
          <WorldRankingsNavDropdown serverCode={serverCode} worldName={worldName}/>
          <WorldConquerNavDropdown serverCode={serverCode} worldName={worldName}/>
          <ToolNavDropdown serverCode={serverCode} worldName={worldName} currentWorld={currentWorld}/>
          {serverCode && <NavbarItem to={formatRoute(SEARCH, {server: serverCode, type: "player", search: ""})}
                                     text={t('title.search')} icon={faMagnifyingGlass}/>}
          <NavThemeSelector/>
          <NavLangSelector/>
        </ul>
      </>
  )

  if(showMobileNav) {
    return (
        <ExtendedSubMenuContext.Provider value={[extendedSubMenu, setExtendedSubMenu]}>
          <div className={"nav-bg " + styles.navbarWrapper + " " + styles.navbarWrapperMobile +
              (extended?(" " + styles.navbarWrapperExtended):"")}>
            <button className={styles.navbarLink + " " + styles.navbarMinimizer + (extended?" mb-2":"")}
                    onClick={() => setExtended(prevState => !prevState)}>
              <FontAwesomeIcon icon={extended ? faChevronLeft : faChevronRight} className={styles.faIcon}/>
            </button>
            {extended && mainNavElement}
          </div>
        </ExtendedSubMenuContext.Provider>
    )
  } else {
    return (
        <ExtendedSubMenuContext.Provider value={[extendedSubMenu, setExtendedSubMenu]}>
          <div className={"nav-bg " + styles.navbarWrapper + " " + styles.navbarWrapperDesktop +
              (extended?(" " + styles.navbarWrapperExtended):"")}>
            {mainNavElement}
            <button className={styles.navbarLink + " " + styles.navbarMinimizer} onClick={() => setExtended(prevState => !prevState)}>
              <FontAwesomeIcon icon={extended?faChevronLeft:faChevronRight} className={styles.faIcon} />
            </button>
          </div>
        </ExtendedSubMenuContext.Provider>
    )
  }
}

export function NavbarMenu({keyName, sub, title, icon}: {keyName: string, sub: ReactNode[], title: string, icon: IconProp}) {
  const [extendedSubMenu, setExtendedSubMenu] = useContext(ExtendedSubMenuContext)
  const extended = extendedSubMenu === keyName

  return (
      <li className={extended?styles.navbarLinkHover:undefined}>
        <button className={styles.navbarLink} onClick={() => setExtendedSubMenu(prevState => (prevState === keyName?undefined:keyName))}>
          <FontAwesomeIcon icon={icon} />
          <span>
            {title}
            <FontAwesomeIcon icon={extended?faChevronDown:faChevronLeft} className={styles.faIcon} />
          </span>
        </button>
        {extended && <ul>
          {sub}
        </ul>}
      </li>
  )
}

export function NavbarItem({to, text, icon}: {to: string, text: string, icon: IconProp}) {
  return (
      <li>
        <Link to={to} className={styles.navbarLink}>
          <FontAwesomeIcon icon={icon} />
          <span>
            {text}
          </span>
        </Link>
      </li>
  )
}

export function NavbarItemDisabled({text, tooltip, icon}: {text: string, tooltip: string, icon: IconProp}) {
  return (
      <li>
        <CustomTooltip overlay={<Tooltip>
          {tooltip}
        </Tooltip>}>
          <div className={styles.navbarLink + " " + styles.navbarLinkDisabled}>
            <FontAwesomeIcon icon={icon} />
            <span>
          {text}
        </span>
          </div>
        </CustomTooltip>
      </li>
  )
}

export function NavbarButton({onClick, text, icon, iconElm}: {onClick: MouseEventHandler<HTMLButtonElement>, text: string, icon?: IconProp, iconElm?: ReactNode}) {
  if(icon === undefined && iconElm === undefined) {
    throw Error("Icon or IconElm needs to be set")
  }

  return (
      <li>
        <button onClick={onClick} className={styles.navbarLink}>
          {icon && <FontAwesomeIcon icon={icon} />}
          {iconElm}
          <span>
            {text}
          </span>
        </button>
      </li>
  )
}
