import React, { useEffect } from "react";
import { Sidebar } from "primereact/sidebar";

import TopBar from "./TopBar/TopBar";
import Footer from "./Footer/Footer";
import { Card } from "primereact/card";

import "./Layout.scss";
import { Dialog } from "primereact/dialog";
import Notifications from "./Notifications/Notifications.js";
import { useNotificationContext } from "../../context/NotificationContext";
import { NotificationContextProvider } from "./../../context/NotificationContext";
import { useThemeContext } from "../../context/ThemeContext";
import { useThemeUpdateContext } from "../../context/ThemeContext";
function Layout(props) {
  const theme = useThemeContext();
  const setTheme = useThemeUpdateContext();

  return (
    <NotificationContextProvider>
      <Notifications />
      <TopBar />
      <div className="Main">
        <div className="Content">{props.content}</div>
      </div>
      <Footer />
    </NotificationContextProvider>
  );
}

export default Layout;
