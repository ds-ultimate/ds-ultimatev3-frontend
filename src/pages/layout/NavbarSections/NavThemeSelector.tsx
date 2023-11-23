import {THEME, useGetCurrentTheme, useSetTheme} from "../theme"
import React from "react"
import {useTranslation} from "react-i18next"
import {NavbarButton} from "../Navbar"
import {faCircleHalfStroke, faSun} from "@fortawesome/free-solid-svg-icons"
import {IconProp} from "@fortawesome/fontawesome-svg-core"


export function NavThemeSelector() {
  const { t } = useTranslation("ui")
  const getCurrentTheme = useGetCurrentTheme()
  const setTheme = useSetTheme()

  let props: [string, string, IconProp]
  if(getCurrentTheme() === THEME.LIGHT) {
    props = [THEME.DARK, t('darkMode'), faCircleHalfStroke]
  } else {
    props = [THEME.LIGHT, t('lightMode'), faSun]
  }

  return (
      <NavbarButton
          text={props[1]}
          onClick={() => setTheme(props[0])}
          icon={props[2]}
      />
  )
}
