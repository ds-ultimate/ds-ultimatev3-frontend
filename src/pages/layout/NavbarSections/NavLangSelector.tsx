import React from "react"
import {useTranslation} from "react-i18next"
import {NavbarButton, NavbarMenu} from "../Navbar"
import {faFlag} from "@fortawesome/free-solid-svg-icons"
import {CZ, DE, GB} from "country-flag-icons/react/3x2"


export function NavLangSelector() {
  const { t, i18n } = useTranslation("ui")
  const selectLang = function(eventData: string | null) {
    if(eventData)
      i18n.changeLanguage(eventData)
  }

  return (
      <NavbarMenu
          keyName={"langSelector"}
          title={t("language")}
          icon={faFlag}
          sub={[
            <NavbarButton onClick={() => selectLang("de")} text={"Deutsch"} iconElm={<DE className={"flags"}/>} />,
            <NavbarButton onClick={() => selectLang("en")} text={"English"} iconElm={<GB className={"flags"}/>} />,
            <NavbarButton onClick={() => selectLang("cs")} text={"Czech"} iconElm={<CZ className={"flags"}/>} />,
          ]}
      />
  )
}
