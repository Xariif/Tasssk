import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ToastProvder } from "./context/ToastContext";
import { AuthContextProvider } from "./context/AuthContext";

import "./index.css";

import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "/node_modules/primeflex/primeflex.css";
const root = ReactDOM.createRoot(document.getElementById("root"));

//<React.StrictMode></React.StrictMode>

root.render(
  <>
    <ToastProvder>
      <BrowserRouter>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
      </BrowserRouter>
    </ToastProvder>
  </>
);
