import {useTranslation} from "react-i18next";
import {de, enGB, cs} from "date-fns/locale"

export default function useDatepickerLanguage() {
  const {i18n} = useTranslation()
  if(i18n.language === "de") {
    return de
  }
  if(i18n.language === "en") {
    return enGB
  }
  if(i18n.language === "cs") {
    return cs
  }
  return enGB
}
