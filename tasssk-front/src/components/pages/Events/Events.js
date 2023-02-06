import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import { useEffect } from "react";
import "./Events.scss";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { GetEvents } from "../../../services/EventService";
import Spinner from "./../../../UI/Spinner";
import { useToastContext } from "../../../context/ToastContext";
import { useNavigate } from "react-router-dom";
function Events() {
  const toastRef = useToastContext();
  const navigate = useNavigate();
  const moment = require("moment");
  const [listStorage, setListStorage] = useLocalStorage("selectedList");

  const [Events, setEvents] = useState();
  useEffect(() => {
    const fetchData = () => {
      GetEvents()
        .then((res) => {
          setEvents(
            res.data.map((x) => ({
              title: x.name,
              date:
                moment(x.date).format("HH:mm:ss") === "00:00:00"
                  ? moment(x.date).format("YYYY-MM-DD")
                  : moment(x.date).format("YYYY-MM-DD HH:mm"),
              id: x.listId,
            }))
          );
        })
        .catch((err) => {
          toastRef.current.show({
            severity: "error",
            summary: "Error",
            detail: err.message,
            life: 5000,
          });
        });
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {Events ? (
        <>
          <FullCalendar
            locale={"en-GB"} //system do 23:59  a nie 24:59
            eventTimeFormat={{
              hour: "2-digit", //2-digit, numeric
              minute: "2-digit", //2-digit, numeric
              meridiem: false, //lowercase, short, narrow, false (display of AM/PM)
              hour12: false, //true, false
            }}
            height={"auto"}
            plugins={[dayGridPlugin]}
            events={Events}
            eventClick={(e) => {
              setListStorage(e.event._def.title);
              navigate("/ToDoList");
            }}
          />
          <p style={{ opacity: "0.5", fontSize: " .8rem" }}>
            *Click at event to go to details
            <br />
            *Events with no selected finish hours or setted for 00:00 are
            displayed for whole day
          </p>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
}

export default Events;
