import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";
import { NotificationContext } from "../../context/NotificationContext";
import { useContext, useEffect } from "react";
import { Button } from "primereact/button";

import "./Notifications.scss";
import { Badge } from "primereact/badge";
import moment from "moment";
import * as signalR from "@microsoft/signalr";
import {
  AddNotification,
  DeleteNotification,
  GetNotifications,
  SetNotificationReaded,
} from "../../services/UserService";
import { useToastContext } from "../../context/ToastContext";
import { ToastAPI } from "./../../context/ToastContext";

export default function Notifications() {
  const { visible, notifications, badge, send } =
    useContext(NotificationContext);
  const [notificationsVisible, setNotificationsVisible] = visible;
  const [notificationsList, setNotificationsList] = notifications;
  const [badgeCount, setBadgeCount] = badge;

  const [SginalRnotifications, SginalRsendNotification] = send;

  const toastRef = useToastContext();

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
      <Button
        label="AddNotification"
        onClick={() => {
          var data = {
            Email: "test@test.pl",
            Header: "Gorące Mamuśki w twojej okolicy!",
            Body: "Zobacz sam w twojej okolicy znaleziono 54 chętne mamuśki",
          };
          AddNotification(data)
            .then((res) => {
              ToastAPI(toastRef, res);
            })
            .then(() => {
              SginalRsendNotification(data.Email, "Got new notification!");
            });
        }}
      ></Button>
      {notificationsList ? (
        notificationsList.map((element) => {
          return (
            <div className="single-notification" key={element.id}>
              <div className="notification-body">
                <div
                  className="text"
                  onClick={() =>
                    SetNotificationReaded(element.id)
                      .then(() => {
                        setNotificationsList(
                          notificationsList.map((x) => {
                            if (x.id == element.id) x.isReaded = true;
                            return x;
                          })
                        );
                      })
                      .finally(() => {
                        var notReaded = notificationsList.filter((val) => {
                          return val.isReaded == false;
                        });
                        setBadgeCount(notReaded.length);
                      })
                  }
                >
                  <h5>{element.header.toUpperCase()}</h5>
                </div>
                <div className="date">
                  {" "}
                  <h5 style={{ fontSize: "0.6rem" }}>
                    {moment(element.createdAt).calendar()}
                  </h5>
                </div>
              </div>

              {element.isReaded ? (
                <></>
              ) : (
                <Badge style={{ margin: "0.5rem" }} severity="info"></Badge>
              )}

              <Button
                icon="pi pi-trash"
                severity="danger"
                rounded
                text
                onClick={() =>
                  DeleteNotification(element.id).then(() => {
                    setNotificationsList(
                      notificationsList.filter((x) => {
                        return x.id != element.id;
                      })
                    );
                  })
                }
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
