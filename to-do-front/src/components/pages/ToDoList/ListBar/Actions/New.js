import { ConfirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Checkbox } from "primereact/checkbox";

import { AddList } from "../../../../../services/ToDoService";
import { useToastContext } from "../../../../../context/ToastContext";

function New({ fetchData, dateNow }) {
  const toastRef = useToastContext();
  const [checkboxHours, setCheckboxHours] = useState(false);
  const [newListDialog, setNewListDialog] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());

  return (
    <>
      <ConfirmDialog
        visible={newListDialog}
        draggable={false}
        onHide={() => {
          setNewListDialog(false);
          setName("");
          setDate();
          setTime();
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

            {checkboxHours ? (
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
                    minDate={date}
                    placeholder="Time"
                    value={time}
                    onChange={(e) => {
                      setTime(new Date(e.value.setSeconds(0)));
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
            ) : null}
            <div
              style={{
                padding: "1rem",
                textAlign: "center",
                marginTop: "1rem",
              }}
            >
              <Checkbox
                onChange={(e) => {
                  if (e.checked == false) {
                    setDate(new Date(date.setHours(0, 0, 0)));
                    setTime();
                  }
                  setCheckboxHours(e.checked);
                }}
                checked={checkboxHours}
              />
              <label style={{ marginLeft: "1rem" }}>Set Hours?</label>
            </div>
          </>
        }
        header="Create new list"
        accept={() => {
          console.log("Data", date);
          AddList({
            listName: name,
            finishDate: date,
          })
            .then((res) => {
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
              }
            })
            .catch((error) => {
              console.log("🚀 ~ file: New.js ~ line 105 ~ New ~ error", error);
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
