import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";

import { LanguageProvider } from "./context/LanguageContext.jsx";
import { HomeInfoProvider } from "./context/HomeInfoContext.jsx";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <HomeInfoProvider>
          <App />
        </HomeInfoProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);
