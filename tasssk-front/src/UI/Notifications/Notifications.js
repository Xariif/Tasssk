import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { NotificationContext } from "../../context/NotificationContext";
import { useContext, useEffect } from "react";
import { Button } from "primereact/button";

import "./Notifications.scss";

import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export default function Notifications() {
  const [notificationsVisible, setNotificationsVisible] =
    useContext(NotificationContext);

  const [connection, setConnection] = useState(null);

  const [notifications, setNoticiations] = useState();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl("http://localhost:5000/notifications")
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      async function start() {
        try {
          await connection.start();
          console.log("SignalR Connected.");
          connection.on("ReceiveNotification", (notifcation) => {
            console.log(notifcation);
          });
        } catch (err) {
          console.log(err);
          setTimeout(start, 5000);
        }
      }

      connection.onclose(async () => {
        await start();
      });

      // Start the connection.
      start();
    }
  }, [connection]);

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
          <Button
            label="Send Test"
            onClick={() => {
              connection.invoke("SendMessage", "test message");
            }}
          ></Button>
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
