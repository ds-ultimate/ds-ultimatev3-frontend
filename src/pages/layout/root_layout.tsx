import {Outlet, useParams} from "react-router-dom";

import Navbar from "./Navbar";
import {Container} from "react-bootstrap";
import {CustomThemeProvider} from "./theme";
import Footer from "./Footer";
import LoadingScreen from "./LoadingScreen";
import CookieConsent from "./CookieConsent"
import Matomo from "../../Matomo"
import ErrorBoundaryConsented from "./ErrorPages/ErrorBoundaryConsented"
import {useTranslation} from "react-i18next"
import React, {useEffect} from "react"
import styles from "./root_layout.module.scss"


export default function RootLayout() {
  const {server, world} = useParams()
  return (
      <CustomThemeProvider>
        <CookieConsent className={"d-flex " + styles.rootContainer}>
          <ErrorBoundaryConsented>
            <Matomo>
              <Navbar serverCode={server} worldName={world}/>
              <div className={styles.mainContainer}>
                <LoadingScreen darken big>
                  <main>
                    <Container>
                      <Outlet />
                    </Container>
                  </main>
                </LoadingScreen>
                <Footer />
              </div>
            </Matomo>
          </ErrorBoundaryConsented>
          <LangWatcher />
        </CookieConsent>
      </CustomThemeProvider>
  )
};

function LangWatcher() {
  const {i18n} = useTranslation()

  useEffect(() => {
    i18n.on("languageChanged", lng => {
      document.documentElement.lang = lng
    })
    document.documentElement.lang = i18n.language
  }, [i18n]);
  return <></>
}
