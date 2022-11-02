import { ConfirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState } from "react";
import { Calendar } from "primereact/calendar";

import { AddList } from "../../../../../services/ToDoService";
import { useToastContext } from "../../../../../context/ToastContext";

function New({ fetchData, dateNow }) {
  const toastRef = useToastContext();
  const [newListDialog, setNewListDialog] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date(new Date().setHours(0, 0, 0)));

  return (
    <>
      <ConfirmDialog
        visible={newListDialog}
        draggable={false}
        onHide={() => {
          setNewListDialog(false);
          setName("");
          setDate();
        }}
        message={
          <>
            <div
              style={{
                display: "flex",
                marginTop: "1rem",
                alignItems: "center",
              }}
            >
              <i
                className="pi pi-check-square"
                style={{ fontSize: "2em", paddingRight: ".5em" }}
              />
              <InputText
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                marginTop: "1rem",

                alignItems: "center",
              }}
            >
              <i
                className="pi pi-calendar"
                style={{
                  fontSize: "2em",
                  paddingRight: ".5em",
                }}
              />

              <Calendar
                placeholder="Finish date"
                style={{
                  fontSize: "2em",
                  top: "50%",
                }}
                id="time24"
                value={date}
                onChange={(e) => {
                  setDate(new Date(e.value.setHours(0, 0, 0)));
                }}
                minDate={dateNow}
              />
            </div>

            <>
              {" "}
              <div
                style={{
                  display: "flex",
                  marginTop: "1rem",
                  alignItems: "center",
                }}
              >
                <i
                  className="pi pi-clock"
                  style={{
                    fontSize: "2em",
                    paddingRight: ".5em",
                  }}
                />
                <Calendar
                  disabled={date != null ? false : true}
                  showTime
                  timeOnly
                  placeholder="Time"
                  value={date}
                  onChange={(e) => {
                    setDate(
                      new Date(
                        date.setHours(
                          e.value.getHours(),
                          e.value.getMinutes(),
                          e.value.getSeconds()
                        )
                      )
                    );
                  }}
                />
              </div>{" "}
              <br />
              <p style={{ opacity: "0.8", fontSize: "0.8rem" }}>
                *If u set hours to 00:00 event will be set for whole day!
              </p>
            </>
          </>
        }
        header="Create new list"
        accept={() => {
          AddList({
            listName: name,
            finishDate: date,
          })
            .then((res) => {
              console.log(res);
              fetchData("new");
              switch (res.code) {
                case 0:
                  toastRef.current.show({
                    severity: "success",
                    summary: "Success ",
                    detail: res.message,
                    life: 5000,
                  });
                  break;
                case 2:
                  toastRef.current.show({
                    severity: "warn",
                    summary: "Warning ",
                    detail: res.message,
                    life: 5000,
                  });
                  break;
                default:
                  toastRef.current.show({
                    severity: "error  ",
                    summary: "Error ",
                    detail: "Unknown error",
                    life: 5000,
                  });
                  break;
              }
            })
            .catch((error) => {
              toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: "Something went wrong",
                life: 5000,
              });
            })
            .finally(() => {
              setNewListDialog(false);
            });
        }}
      />
      <Button
        className="p-button-rounded p-button-success"
        icon="pi pi-plus"
        style={{ marginRight: "5px" }}
        label="New"
        onClick={() => {
          setNewListDialog(true);
        }}
      />
    </>
  );
}

export default New;
