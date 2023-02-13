import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { NotificationContext } from "./../context/NotificationContext";
import { useContext } from "react";
import { Button } from "primereact/button";
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
      position="right"
      visible={notificationsVisible}
      modal={false}
      style={{ display: "flex", justifyContent: "left" }}
      onHide={() => setNotificationsVisible(false)}
      icons={
        <div
          style={{
            margin: 0,
            textAlign: "left",
            display: "flex",
            height: "100%",
            alignItems: "center",
            fontSize: "1.2rem",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          <i
            className="pi pi-fw pi-bell"
            style={{
              fontSize: "1.5rem",
              fontWeight: "bold",
              marginRight: ".5rem",
            }}
          />
          NOTIFICATIONS
        </div>
      }
    >
      {items ? (
        items.map((element) => {
          return (
            <div
              style={{
                width: "100%",
                fontSize: "1rem",
                padding: "0.1rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
              key={element}
            >
              <div
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  lineHeight: "2rem",
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxHeight: "50px",
                }}
              >
                {" "}
                {element}
              </div>
              <Button
                icon="pi pi-trash"
                className="p-button-danger p-button-rounded p-button-text"
                style={{ marginLeft: "0.5rem", minWidth: "max-content" }}
              ></Button>
            </div>
          );
        })
      ) : (
        <div
          style={{
            display: "flex",
            textAlign: "center",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "1.2rem",
          }}
        >
          Here you can find your notifications!
        </div>
      )}
    </Sidebar>
  );
}
