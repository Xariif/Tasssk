import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { NotificationContext } from "../../context/NotificationContext";
import { useContext } from "react";
import { Button } from "primereact/button";

import "./Notifications.scss";

export default function Notifications() {
  const [notificationsVisible, setNotificationsVisible] =
    useContext(NotificationContext);

  var items = [
    "Rate us!",
    "Tutorial",
    "Tips and tricks",
    "Welcone coś tam dłuższego trochę bardziej jescze bardzieje coś tam dłuższego trochę bardziej jescze bardziej zeby było dluzej zeby było dluzej",
  ];

  return (
    <Sidebar
      className="notifications"
      position="right"
      visible={notificationsVisible}
      modal={false}
      onHide={() => setNotificationsVisible(false)}
      icons={
        <>
          <i className="pi pi-fw pi-bell" style={{ fontSize: "2rem" }} />
          NOTIFICATIONS
        </>
      }
    >
      {items ? (
        items.map((element) => {
          return (
            <div className="single-notification" key={element}>
              <div className="text">{element}</div>
              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                outlined
              ></Button>
            </div>
          );
        })
      ) : (
        <div className="no-notifications">
          Here you can find your notifications!
        </div>
      )}
    </Sidebar>
  );
}
