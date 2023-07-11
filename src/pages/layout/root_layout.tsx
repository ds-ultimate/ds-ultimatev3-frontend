import {Outlet, useParams} from "react-router-dom";

import Navbar from "./Navbar";
import {Container} from "react-bootstrap";
import {CustomThemeProvider} from "./theme";
import Footer from "./Footer";

export default function RootLayout() {
  const {server, world} = useParams()
  return (
      <CustomThemeProvider>
        <div className={"rootLayout main-container"}>
          <Navbar serverCode={server} worldName={world}/>
          <main style={{flexGrow: 3}}>
            <Container>
              <Outlet />
            </Container>
          </main>
          <Footer />
        </div>
      </CustomThemeProvider>
  )
};
