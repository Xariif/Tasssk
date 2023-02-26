import React, { createContext, useContext, useState, useEffect } from "react";
import { GetNotifications } from "../services/UserService";
import { useAPI } from "./../hooks/useAPI";
import useSignalR from "./../hooks/useSignalR";
export const NotificationContext = createContext();

export function useNotificationContext() {
  return useContext(NotificationContext);
}

export function NotificationContextProvider({ children }) {
  const [SignalRnotifications, SignalRsendNotification] = useSignalR();

  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState();
  const [badgeCount, setBadgeCount] = useState();

  useEffect(() => {
    GetNotifications().then((res) => {
      setNotifications(res.data);
      var notReaded = res.data.filter((val) => {
        return val.isReaded == false;
      });
      setBadgeCount(notReaded.length);
    });
  }, [SignalRnotifications]);

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
