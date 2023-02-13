import { ConfirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { useState } from "react";
import { Calendar } from "primereact/calendar";
import useLocalStorage from "../../../../../hooks/useLocalStorage";
import { AddList } from "../../../../../services/ToDoService";
import { useToastContext } from "../../../../../context/ToastContext";

function New({ loadData, dateNow }, props) {
  const toastRef = useToastContext();
  const [newListDialog, setNewListDialog] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date(new Date().setHours(0, 0, 0)));
  const [listStorage, setListStorage] = useLocalStorage("selectedList");

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
            <span
              className="p-input-icon-right"
              style={{
                display: "flex",
                marginTop: "1rem",
              }}
            >
              <i className="pi pi-book" />
              <InputText
                style={{ width: "100%" }}
                placeholder="Name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </span>
            <span
              style={{
                display: "flex",
                marginTop: "1rem",
              }}
            >
              <Calendar
                placeholder="Finish date"
                style={{ width: "100%" }}
                showIcon
                id="time24"
                value={date}
                onChange={(e) => {
                  setDate(new Date(e.value.setHours(0, 0, 0)));
                }}
              />
            </span>
            <div
              style={{
                display: "flex",
                marginTop: "1rem",
                alignItems: "center",
              }}
            >
              <Calendar
                disabled={date != null ? false : true}
                style={{ width: "100%" }}
                showIcon
                icon="pi pi-clock"
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
              *If you set hours to 00:00
              <br /> event will be setted for whole day!
            </p>
          </>
        }
        header="Create new list"
        accept={() => {
          AddList({
            listName: name,
            finishDate: date,
          })
            .then((res) => {
              setListStorage(name);
              loadData();

              toastRef.current.show({
                severity: "success",
                summary: "Success ",
                detail: res.message,
                life: 5000,
              });
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
