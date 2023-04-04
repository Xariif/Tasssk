import React, { useState, useEffect, useContext } from "react";
import * as signalR from "@microsoft/signalr";
import useLocalStorage from "./useLocalStorage";
import { SelecetedDataContext } from "context/SelectedDataContext";

export default function useListSignalR(prop) {
  console.log(prop);
  const [connection, setConnection] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [email, setEmail] = useLocalStorage("email");
  const [listStorage, setListStorage] = useLocalStorage("selectedList");
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5000/list?listId=" + prop)
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
        console.log(notification);
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
