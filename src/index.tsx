import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {I18nextProvider} from "react-i18next";
import i18next from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"

import trans_de_ui from "./translations/de/ui.json"
import trans_en_ui from "./translations/en/ui.json"
import trans_cs_ui from "./translations/cs/ui.json"

import trans_de_datatable from "./translations/de/datatable.json"
import trans_en_datatable from "./translations/en/datatable.json"
import trans_cs_datatable from "./translations/cs/datatable.json"

import trans_de_error from "./translations/de/error.json"
import trans_en_error from "./translations/en/error.json"
import trans_cs_error from "./translations/cs/error.json"

import Debugbar from "./util/Debugbar";

import "react-datepicker/dist/react-datepicker.css";

//TODO: icons with different sizes
//TODO: index.html -> import icons / Initial title / check everything
//TODO: manifest.json -> rewrite this
//TODO: robots.txt copy from current
//TODO: upload web vitals to matomo / own service
//TODO: automatic exception reporting -> based on cookie settings
//TODO: workflow for compile & upload

// noinspection JSIgnoredPromiseFromCall
i18next.use(LanguageDetector).init({
  interpolation: {
    escapeValue: false, // React already handles escaping
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage']
  },
  resources: {
    de: {
      ui: trans_de_ui,
      datatable: trans_de_datatable,
      error: trans_de_error,
    },
    en: {
      ui: trans_en_ui,
      datatable: trans_en_datatable,
      error: trans_en_error,
    },
    cs: {
      ui: trans_cs_ui,
      datatable: trans_cs_datatable,
      error: trans_cs_error,
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
      <I18nextProvider i18n={i18next}>
        <App/>
        <Debugbar />
      </I18nextProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
