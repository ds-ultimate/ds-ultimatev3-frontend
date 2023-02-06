import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import router from 'react-named-routes'

import RootLayout from "./pages/layout/root_layout"
const Index = lazy(() => import("./pages/content/index"));
const World = lazy(() => import("./pages/content/world"));
//TODO better fallback for loading

router.registerRoutes('', {
  index: { path: '/', element: <Index />},
  world: { path: '/:server/:world', element: <World />},
})

function App() {
  return (
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route {...router.getRoute('index')}/>
              <Route {...router.getRoute('world')}/>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default App;
