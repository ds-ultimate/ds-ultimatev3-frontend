import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import RootLayout from "./pages/layout/root_layout"
import * as RouteHolder from "./util/routes";
const Index = lazy(() => import("./pages/content/index"));
const Server = lazy(() => import("./pages/content/server"));
const World = lazy(() => import("./pages/content/world"));
const WorldPlayerCur = lazy(() => import("./pages/content/worldPlayerCurrent"));
const WorldPlayerHist = lazy(() => import("./pages/content/worldPlayerHistory"));
const WorldAllyCur = lazy(() => import("./pages/content/worldAllyCurrent"));
const WorldAllyHist = lazy(() => import("./pages/content/worldAllyHistory"));
const WorldConquer = lazy(() => import("./pages/content/worldConquer"));
const WorldConquerDaily = lazy(() => import("./pages/content/worldConquerDaily"));
//TODO better fallback for loading

function App() {
  return (
      <BrowserRouter basename={process.env.REACT_APP_BASE_DIR}>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path={'/'} element={<RootLayout />}>
              <Route path={RouteHolder.INDEX} element={<Index />}/>
              <Route path={RouteHolder.SERVER} element={<Server />}/>
              <Route path={RouteHolder.WORLD} element={<World />}/>
              <Route path={RouteHolder.WORLD_PLAYER_CUR} element={<WorldPlayerCur />}/>
              <Route path={RouteHolder.WORLD_PLAYER_HIST} element={<WorldPlayerHist />}/>
              <Route path={RouteHolder.WORLD_ALLY_CUR} element={<WorldAllyCur />}/>
              <Route path={RouteHolder.WORLD_ALLY_HIST} element={<WorldAllyHist />}/>
              <Route path={RouteHolder.WORLD_CONQUER} element={<WorldConquer />}/>
              <Route path={RouteHolder.WORLD_CONQUER_DAILY} element={<WorldConquerDaily />}/>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default App;
