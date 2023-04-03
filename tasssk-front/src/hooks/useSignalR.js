import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import useLocalStorage from "./useLocalStorage";
import notificationSound from "./notification_sound.mp3";

export default function useSignalR() {
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useLocalStorage("email");

  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/notifications?email=" + email)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(async () => {
          console.log("Connected to SignalR hub");
        })
        .catch((error) => {
          console.error(error);
        });

      connection.on("ReceiveNotification", (notification) => {
        const sound = new Audio(notificationSound);

        sound.play();
        setNotifications((notifications) => [...notifications, notification]); //czy powinienem to robić używając true/false state?
      });
    }
  }, [connection]);

  const sendNotification = (who, notification) => {
    connection.invoke("SendNotification", who, notification).catch((error) => {
      console.error(error);
    });
  };

  return [notifications, sendNotification];
}
