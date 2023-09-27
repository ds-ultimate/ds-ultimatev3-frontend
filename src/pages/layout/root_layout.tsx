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

export default function RootLayout() {
  const {server, world} = useParams()
  return (
      <CustomThemeProvider>
        <CookieConsent className={"rootLayout main-container"}>
          <ErrorBoundaryConsented>
            <Matomo>
              <Navbar serverCode={server} worldName={world}/>
              <LoadingScreen style={{flexGrow: 3}} darken big>
                <main>
                  <Container>
                    <Outlet />
                  </Container>
                </main>
              </LoadingScreen>
              <Footer />
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
