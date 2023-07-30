import {createContext, CSSProperties, ReactNode, useCallback, useContext} from "react";
import usePersistentState from "../../util/persitentState"
import {Button, Card, Form} from "react-bootstrap"
import styles from "./CookieConsent.module.scss"
import {useTranslation} from "react-i18next"


const CookieConsentContext = createContext<[string[], boolean]>([[], false])
export const ResetCookieConsentContext = createContext<() => void>(() => {})

const all = ["matomo", "errorReports"]

export default function CookieConsent({children, style, className}: {children?: ReactNode[] | ReactNode, style?: CSSProperties, className?: string}) {
  const [consented, setConsented] = usePersistentState<[string[], boolean]>("cookie-consent", [[], false])
  const { t } = useTranslation("ui")

  const resetConsent = useCallback(() => {
    setConsented(old => [old[0], false])
  }, [setConsented])
  const setConsent = useCallback((id: string, val: boolean | undefined) => {
    setConsented((prevState) => {
      if (val === undefined) {
        val = !prevState[0].includes(id)
      }
      if (val) {
        const newState = prevState[0].slice()
        if (!newState.includes(id)) {
          newState.push(id)
        }
        return [newState, prevState[1]]
      } else {
        return [prevState[0].filter(v => v !== id), prevState[1]]
      }
    })
  }, [setConsented])

  return (
      <div className={styles.cookieContainer + (className?" "+className:"")} style={style}>
        {!consented[1] && <div className={styles.cookieDiv + " pt-5"}>
          <div className={styles.cookeDialog + " container-bg"}>
          <Card>
            <Card.Body>
              <Card.Title className={"mb-3"}>{t("cookie.title")}</Card.Title>
              <Form>
                <Form.Check type={"switch"} checked={true} disabled label={t("cookie.essential")}/>
                <Form.Check type={"switch"} checked={consented[0].includes("errorReports")} onChange={() => setConsent("errorReports", undefined)} label={t("cookie.errorReports")}/>
                <Form.Check type={"switch"} checked={consented[0].includes("matomo")} onChange={() => setConsent("matomo", undefined)} label={t("cookie.matomo")}/>
                <div className={"mt-3 d-flex"}>
                  <Button onClick={() => setConsented([all, true])} variant={"success"} className={"me-2"}>{t("cookie.acceptAll")}</Button>
                  <Button onClick={() => setConsented(old => [old[0], true])} variant={"warning"} className={"ms-auto"}>{t("cookie.acceptSelected")}</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
          </div>
        </div>}
        <ResetCookieConsentContext.Provider value={resetConsent}>
          <CookieConsentContext.Provider value={consented}>
            {children}
          </CookieConsentContext.Provider>
        </ResetCookieConsentContext.Provider>
      </div>
  )
}

export function useIsConsented(id: string) {
  const [result, global] = useContext(CookieConsentContext)
  if(!global) return false
  return result.includes(id)
}
