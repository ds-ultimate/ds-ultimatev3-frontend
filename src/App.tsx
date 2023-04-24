import React, {Suspense} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import RootLayout from "./pages/layout/root_layout"
import * as RouteHolder from "./util/routes";

import "./bootstrap.scss"

import IndexPage from "./pages/content/Index";
import ServerPage from "./pages/content/Server";
import WorldPage from "./pages/content/World";
import WorldPlayerCurrentPage from "./pages/content/WorldPlayerCurrent";
import WorldPlayerHistoryPage from "./pages/content/WorldPlayerHistory";
import WorldAllyCurrentPage from "./pages/content/WorldAllyCurrent";
import WorldAllyHistoryPage from "./pages/content/WorldAllyHistory";
import WorldConquerPage from "./pages/content/WorldConquer";
import WorldConquerDailyPage from "./pages/content/WorldConquerDaily";
import AllyPage from "./pages/content/Records/Ally";
/*
const IndexPage = lazy(() => import("./pages/content/Index"));
*/
//TODO better fallback for loading

function App() {
  return (
      <BrowserRouter basename={process.env.REACT_APP_BASE_DIR}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path={'/'} element={<RootLayout />}>
              <Route path={RouteHolder.INDEX} element={<IndexPage />}/>
              <Route path={RouteHolder.SERVER} element={<ServerPage />}/>
              <Route path={RouteHolder.WORLD} element={<WorldPage />}/>
              <Route path={RouteHolder.WORLD_PLAYER_CUR} element={<WorldPlayerCurrentPage />}/>
              <Route path={RouteHolder.WORLD_PLAYER_HIST} element={<WorldPlayerHistoryPage />}/>
              <Route path={RouteHolder.WORLD_ALLY_CUR} element={<WorldAllyCurrentPage />}/>
              <Route path={RouteHolder.WORLD_ALLY_HIST} element={<WorldAllyHistoryPage />}/>
              <Route path={RouteHolder.WORLD_CONQUER} element={<WorldConquerPage />}/>
              <Route path={RouteHolder.WORLD_CONQUER_DAILY} element={<WorldConquerDailyPage />}/>
              <Route path={RouteHolder.ALLY_INFO} element={<AllyPage />}/>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default App;
