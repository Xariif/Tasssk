import React from "react";
import { Sidebar } from "primereact/sidebar";

import TopBar from "./TopBar/TopBar";
import Footer from "./Footer/Footer";
import { Card } from "primereact/card";

import "./Layout.scss";
import { Dialog } from "primereact/dialog";
import Notifications from "../../UI/Notifications/Notifications.js";
import { useNotificationContext } from "../../context/NotificationContext";

function Layout(props) {
  return (
    <>
      <Notifications />
      <TopBar />
      <div className="Main">
        <div className="Content">{props.content}</div>
      </div>
      <Footer />
    </>
  );
}

export default Layout;
