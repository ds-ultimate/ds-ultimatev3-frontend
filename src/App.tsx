import React, {Suspense} from 'react';
import {BrowserRouter, Route, Routes} from "react-router-dom";

import RootLayout from "./pages/layout/root_layout"
import * as RouteHolder from "./pages/routes";
import * as ToolRouteHolder from "./pages/tools/routes";

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
import AllyPage from "./pages/content/Records/Ally/Ally";
import AllyConquerPage from "./pages/content/Records/Ally/AllyConquer";
import AllyAllyChangePage from "./pages/content/Records/Ally/AllyAllyChange";
import AllyBashRankingPage from "./pages/content/Records/Ally/AllyBashRanking";
import PlayerPage from "./pages/content/Records/Player/Player";
import PlayerConquerPage from "./pages/content/Records/Player/PlayerConquer";
import PlayerAllyChangePage from "./pages/content/Records/Player/PlayerAllyChange";
import VillagePage from "./pages/content/Records/Village/Village";
import VillageConquerPage from "./pages/content/Records/Village/VillageConquer";
import ChangelogPage from "./pages/content/Changelog";
import LegalPage from "./pages/content/LegalPage";
import TeamPage from "./pages/content/Team";
import {ForcedLoadingScreen} from "./pages/layout/LoadingScreen";
import ErrorPage from "./pages/layout/ErrorPage"
import SearchPage from "./pages/content/Search"
import DistanceCalcPage from "./pages/tools/DistanceCalc"
import PointCalcPage from "./pages/tools/PointCalc"

/*
const IndexPage = lazy(() => import("./pages/content/Index"));
*/

function App() {
  return (
      <BrowserRouter basename={process.env.REACT_APP_BASE_DIR}>
        <Suspense fallback={<ForcedLoadingScreen />}>
          <Routes>
            <Route path={'/'} element={<RootLayout />}>
              <Route path={RouteHolder.INDEX} element={<IndexPage />}/>
              <Route path={RouteHolder.SERVER} element={<ServerPage />}/>
              <Route path={RouteHolder.SEARCH} element={<SearchPage />}/>
              <Route path={RouteHolder.SEARCH_EMPTY} element={<SearchPage />}/>
              <Route path={RouteHolder.WORLD} element={<WorldPage />}/>
              <Route path={RouteHolder.WORLD_PLAYER_CUR} element={<WorldPlayerCurrentPage />}/>
              <Route path={RouteHolder.WORLD_PLAYER_HIST} element={<WorldPlayerHistoryPage />}/>
              <Route path={RouteHolder.WORLD_ALLY_CUR} element={<WorldAllyCurrentPage />}/>
              <Route path={RouteHolder.WORLD_ALLY_HIST} element={<WorldAllyHistoryPage />}/>
              <Route path={RouteHolder.WORLD_CONQUER} element={<WorldConquerPage />}/>
              <Route path={RouteHolder.WORLD_CONQUER_DAILY} element={<WorldConquerDailyPage />}/>
              <Route path={RouteHolder.ALLY_INFO} element={<AllyPage />}/>
              <Route path={RouteHolder.ALLY_CONQUER} element={<AllyConquerPage />}/>
              <Route path={RouteHolder.ALLY_ALLY_CHANGES} element={<AllyAllyChangePage />}/>
              <Route path={RouteHolder.ALLY_BASH_RANKING} element={<AllyBashRankingPage />}/>
              <Route path={RouteHolder.PLAYER_INFO} element={<PlayerPage />}/>
              <Route path={RouteHolder.PlAYER_CONQUER} element={<PlayerConquerPage />}/>
              <Route path={RouteHolder.PLAYER_ALLY_CHANGES} element={<PlayerAllyChangePage />}/>
              <Route path={RouteHolder.VILLAGE_INFO} element={<VillagePage />}/>
              <Route path={RouteHolder.VILLAGE_CONQUER} element={<VillageConquerPage />}/>

              <Route path={ToolRouteHolder.DISTANCE_CALC} element={<DistanceCalcPage />}/>
              <Route path={ToolRouteHolder.POINT_CALC} element={<PointCalcPage />}/>

              <Route path={RouteHolder.CHANGELOG_PAGE} element={<ChangelogPage />}/>
              <Route path={RouteHolder.LEGAL_PAGE} element={<LegalPage />}/>
              <Route path={RouteHolder.TEAM_PAGE} element={<TeamPage />}/>
              <Route path={"*"} element={<ErrorPage error={{
                isFrontend: true,
                code: 404,
                k: "404.generic",
                p: {},
              }} />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default App;
