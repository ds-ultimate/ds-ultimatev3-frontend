import {useTranslation} from "react-i18next";

type api_type = string | (() => string)

function isCallback<T, P extends Array<any>>(maybeFunction: T | ((...args: P) => T)): maybeFunction is (...args: P) => T {
  return typeof maybeFunction === 'function'
}
export default function Datatable({api}: {api: api_type}) {
  const { t } = useTranslation("datatable")

  let apiURL: string
  if(isCallback(api)) {
    apiURL = api()
  } else {
    apiURL = api
  }
}
