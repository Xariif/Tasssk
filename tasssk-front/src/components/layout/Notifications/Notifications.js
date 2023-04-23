import { useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { NotificationContext } from "../../../context/NotificationContext";
import { useContext, useEffect } from "react";
import { Button } from "primereact/button";

import "./Notifications.scss";
import { Badge } from "primereact/badge";
import moment from "moment";
import {
  CreateNotification,
  DeleteNotification,
  GetInviteNotification,
  SetNotificationReaded,
} from "../../../services/NotificationService";
import { useToastContext } from "../../../context/ToastContext";
import { ToastAPI } from "../../../context/ToastContext";
import { AcceptInvite } from "services/ListService";

export default function Notifications() {
  const { visible, notifications, badge } = useContext(NotificationContext);
  const [notificationsVisible, setNotificationsVisible] = visible;
  const [notificationsList, setNotificationsList] = notifications;
  const [badgeCount, setBadgeCount] = badge;

  const toastRef = useToastContext();

  return (
    <Sidebar
      style={{ width: "450px" }}
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
      {notificationsList ? (
        notificationsList.map((element) => {
          return <Notification key={element.id} element={element} />;
        })
      ) : (
        <div className="no-notifications">
          Here you can find your notifications!
        </div>
      )}
    </Sidebar>
  );

  function Notification({ element }) {
    switch (element.type) {
      case "Notification":
        return (
          <div className="notification" key={element.id}>
            <div
              style={{
                opacity: element.isReaded ? "0.5" : "1",
              }}
              className="notification-body"
              onClick={() =>
                SetNotificationReaded(element.id).then(() => {
                  setNotificationsList(
                    notificationsList.map((x) => {
                      if (x.id === element.id) x.isReaded = true;
                      return x;
                    })
                  );
                })
              }
            >
              <div style={{ paddingRight: "8px" }}>
                <div style={{ fontWeight: "bold" }}>{element.header}</div>
                {element.body}
                <h5 style={{ color: " var(--primary-color)" }}>
                  {moment(element.createdAt).calendar()}
                </h5>{" "}
              </div>
            </div>

            <div style={{ display: "inline-flex", alignItems: "center" }}>
              {!element.isReaded && <Badge severity="info"></Badge>}
              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                text
                onClick={() =>
                  DeleteNotification(element.id).then(() => {
                    setNotificationsList((notificationsList) =>
                      notificationsList.filter((x) => {
                        return x.id != element.id;
                      })
                    );
                  })
                }
              ></Button>
            </div>
          </div>
        );
        break;
      case "Invite":
        return (
          <div
            className="notification"
            key={element.id}
            style={{ color: "lightgreen" }}
          >
            <div
              className="notification-body"
              onClick={() => {
                console.log(element);
                setNotificationsList(
                  notificationsList.map((x) => {
                    if (x.id === element.id) x.isReaded = true;
                    return x;
                  })
                );
                SetNotificationReaded(element.id);
              }}
            >
              <div style={{ fontWeight: "bold" }}>{element.header}</div>
              {element.body}
              <h5 style={{ color: " var(--primary-color)" }}>
                {moment(element.createdAt).calendar()}
              </h5>
            </div>
            {!element.isReaded && <Badge severity="info"></Badge>}

            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Button
                icon="pi pi-check"
                text
                severity="success"
                rounded
                label="Accept"
                onClick={() => {
                  GetInviteNotification(element.id).then((res) => {
                    AcceptInvite(res.data)
                      .then((res) => {
                        ToastAPI(toastRef, res);
                        return res;
                      })
                      .catch((err) => {
                        ToastAPI(toastRef, err);
                      })
                      .finally(() => {
                        DeleteNotification(element.id).then(() => {
                          setNotificationsList((notificationsList) =>
                            notificationsList.filter((x) => {
                              return x.id != element.id;
                            })
                          );
                        });
                      });
                  });
                }}
              ></Button>
              <Button
                text
                icon="pi pi-times"
                label="Reject"
                severity="danger"
                rounded
                onClick={() =>
                  DeleteNotification(element.id).then(() => {
                    setNotificationsList((notificationsList) =>
                      notificationsList.filter((x) => {
                        return x.id != element.id;
                      })
                    );
                  })
                }
              ></Button>
            </div>
          </div>
        );

        break;
      default:
        break;
    }
  }
}
