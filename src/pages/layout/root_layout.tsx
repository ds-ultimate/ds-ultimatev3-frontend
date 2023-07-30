import {Outlet, useParams} from "react-router-dom";

import Navbar from "./Navbar";
import {Container} from "react-bootstrap";
import {CustomThemeProvider} from "./theme";
import Footer from "./Footer";
import LoadingScreen from "./LoadingScreen";
import CookieConsent from "./CookieConsent"
import Matomo from "../../Matomo"

export default function RootLayout() {
  const {server, world} = useParams()
  return (
      <CustomThemeProvider>
        <CookieConsent className={"rootLayout main-container"}>
          <Matomo>
            <Navbar serverCode={server} worldName={world}/>
            <LoadingScreen style={{flexGrow: 3}} darken>
              <main>
                <Container>
                  <Outlet />
                </Container>
              </main>
            </LoadingScreen>
            <Footer />
          </Matomo>
        </CookieConsent>
      </CustomThemeProvider>
  )
};
