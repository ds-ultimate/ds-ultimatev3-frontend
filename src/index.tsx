import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

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

import trans_de_tool from "./translations/de/tool.json"
import trans_en_tool from "./translations/en/tool.json"
import trans_cs_tool from "./translations/cs/tool.json"

import Debugbar from "./util/Debugbar";

import "react-datepicker/dist/react-datepicker.css";

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
      tool: trans_de_tool,
    },
    en: {
      ui: trans_en_ui,
      datatable: trans_en_datatable,
      error: trans_en_error,
      tool: trans_en_tool,
    },
    cs: {
      ui: trans_cs_ui,
      datatable: trans_cs_datatable,
      error: trans_cs_error,
      tool: trans_cs_tool,
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
