import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { ToastProvder } from "./context/ToastContext";
import { AuthContextProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";

import "./index.css";
import { NotificationContextProvider } from "./context/NotificationContext";

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  // <React.StrictMode>

  <ToastProvder>
    <BrowserRouter>
      <NotificationContextProvider>
        <ThemeContextProvider>
          <AuthContextProvider>
            <App />
          </AuthContextProvider>
        </ThemeContextProvider>
      </NotificationContextProvider>
    </BrowserRouter>
  </ToastProvder>

  // </React.StrictMode>
);
