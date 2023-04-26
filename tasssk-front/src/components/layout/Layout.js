import React, { useEffect } from "react";
import { Sidebar } from "primereact/sidebar";

import TopBar from "./TopBar/TopBar";
import Footer from "./Footer/Footer";
import { Card } from "primereact/card";

import { Dialog } from "primereact/dialog";
import Notifications from "./Notifications/Notifications.js";
import { useNotificationContext } from "../../context/NotificationContext";
import { NotificationContextProvider } from "./../../context/NotificationContext";

import PrimeReact from "primereact/api";
import useLocalStorage from "hooks/useLocalStorage";
function Layout(props) {
  const [darkMode, setTheme] = useLocalStorage("darkMode");
  useEffect(() => {
    if (darkMode) {
      PrimeReact.changeTheme(
        "lara-light-blue",
        "lara-dark-blue",
        "theme-link",
        () => {}
      );
    }
  }, [darkMode]);
  return (
    <NotificationContextProvider>
      <Notifications />
      <TopBar />
      <div className="Main" style={{
        padding: "1rem",
        minHeight: "calc(100vh - 90px)",
      }}>
        <div className="Content" style={{
          backgroundColor: "var(--surface-card)",
          borderRadius:"var(--border-radius)",
          padding: "1rem",
        }}>{props.content}</div>
      </div>
      <Footer />
    </NotificationContextProvider>
  );
}

export default Layout;
