import React, { createContext, useContext, useState, useEffect } from "react";
import { GetNotifications } from "../services/NotificationService";
import useSignalRNotifications from "../hooks/useSignalRNotifications";

export const NotificationContext = createContext(null);

export function useNotificationContext() {
  return useContext(NotificationContext);
}

export function NotificationContextProvider({ children }) {
  const [SignalRnotifications, SignalRsendNotification] =
    useSignalRNotifications();
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    GetNotifications().then((res) => {
      res.data.length > 0 && setNotifications((notifications) => res.data);
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
