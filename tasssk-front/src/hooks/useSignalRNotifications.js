import { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import useLocalStorage from "./useLocalStorage";

  var url = process.env.REACT_APP_SIGNALR_URL;


const useSignalRNotifications = () => {
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useLocalStorage("email");
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl(url+"notifications?email=" + email)
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  }, [email]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(async () => {
          console.log("Connected to SignalR Notifications hub");
        })
        .catch((error) => {
          console.error(error);
        });

      connection.on("ReceiveNotification", (notification) => {
        const sound = new Audio("/sounds/notification.mp3");
        sound.play();

        setNotifications((notifications) => [...notifications, notification]);
      });
    }
  }, [connection]);

  const sendNotification = (who, notification) => {
    connection.invoke("SendNotification", who, notification).catch((error) => {
      console.error(error);
    });
  };

  return [notifications, sendNotification];
};

export default useSignalRNotifications;
