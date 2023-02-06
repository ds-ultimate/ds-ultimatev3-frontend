import {Outlet, useParams} from "react-router-dom";

import Navbar from "./navbar";

export default function RootLayout() {
  const {server, world} = useParams()
  return (
      <>
        <Navbar serverCode={server} worldName={world}/>
        <main>
          <Outlet />
        </main>
        {/* Footer */}
        {/* End footer */}
      </>
  )
};
