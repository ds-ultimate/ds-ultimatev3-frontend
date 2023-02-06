import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './css/menu.css'

//TODO: icons with different sizes
//TODO: index.html -> import icons / Initial title / check everything
//TODO: manifest.json -> rewrite this
//TODO: robots.txt copy from current
//TODO: matomo
//TODO: upload web vitals to matomo / own service
//TODO: automatic exception reporting
//TODO: workflow for compile & upload

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
