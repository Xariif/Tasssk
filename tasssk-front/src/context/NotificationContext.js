import React, { createContext, useContext, useState } from "react";

export const NotificationContext = createContext();

export function useNotificationContext() {
  return useContext(NotificationContext);
}

export function NotificationContextProvider({ children }) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <NotificationContext.Provider value={[visible, setVisible]}>
        {children}
      </NotificationContext.Provider>
    </>
  );
}
