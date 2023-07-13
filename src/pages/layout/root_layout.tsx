import {Outlet, useParams} from "react-router-dom";

import Navbar from "./Navbar";
import {Container} from "react-bootstrap";
import {CustomThemeProvider} from "./theme";
import Footer from "./Footer";
import LoadingScreen from "./LoadingScreen";

export default function RootLayout() {
  const {server, world} = useParams()
  return (
      <CustomThemeProvider>
        <div className={"rootLayout main-container"}>
          <Navbar serverCode={server} worldName={world}/>
          <LoadingScreen style={{flexGrow: 3}} darken>
            <main>
              <Container>
                <Outlet />
              </Container>
            </main>
          </LoadingScreen>
          <Footer />
        </div>
      </CustomThemeProvider>
  )
};
