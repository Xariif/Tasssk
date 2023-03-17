import React, { createContext, useContext, useState, useEffect } from "react";
import { GetNotifications } from "../services/NotificationService";
import { useAPI } from "./../hooks/useAPI";
import useSignalR from "./../hooks/useSignalR";

import notificationSound from "./notification_sound.mp3";

export const NotificationContext = createContext();

export function useNotificationContext() {
  return useContext(NotificationContext);
}

export function NotificationContextProvider({ children }) {
  const [SignalRnotifications, SignalRsendNotification] = useSignalR();
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);
  const sound = new Audio(notificationSound);

  useEffect(() => {
    GetNotifications().then((res) => {
      setNotifications((notifications) => res.data);
    });
  }, [SignalRnotifications]);

  useEffect(() => {
    const notReaded = notifications.filter((val) => {
      return val.isReaded === false;
    });
    setBadgeCount(notReaded.length);
  }, [notifications]);

  return (
    <>
      <NotificationContext.Provider
        value={{
          visible: [visible, setVisible],
          notifications: [notifications, setNotifications],
          badge: [badgeCount, setBadgeCount],
          send: [SignalRnotifications, SignalRsendNotification],
        }}
      >
        {children}
      </NotificationContext.Provider>
    </>
  );
}
