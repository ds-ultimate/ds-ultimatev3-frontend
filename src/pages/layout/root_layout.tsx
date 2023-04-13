import {Outlet, useParams} from "react-router-dom";

import Navbar from "./Navbar";
import {Container} from "react-bootstrap";
import {CustomThemeProvider} from "./theme";

export default function RootLayout() {
  const {server, world} = useParams()
  return (
      <CustomThemeProvider>
        <div className={"rootLayout"}>
          <Navbar serverCode={server} worldName={world}/>
          <main>
            <Container>
              <Outlet />
            </Container>
          </main>
          {/* Footer */}
          {/* End footer */}
        </div>
      </CustomThemeProvider>
  )
};
