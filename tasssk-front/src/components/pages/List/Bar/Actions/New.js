import { ConfirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import useLocalStorage from "../../../../../hooks/useLocalStorage";
import { CreateList } from "../../../../../services/ListService";
import { useToastContext } from "../../../../../context/ToastContext";
import { useRef, useState } from "react";

function New({ fetchData }) {
  const refFocusName = useRef(null);
  const toastRef = useToastContext();
  const [newListDialog, setNewListDialog] = useState(false);
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());

  var dateNow = new Date();
  dateNow.setDate(dateNow.getDate());
  dateNow.setMonth(dateNow.getMonth());
  dateNow.setFullYear(dateNow.getFullYear());

  return (
    <>
      <ConfirmDialog
        visible={newListDialog}
        draggable={false}
        onHide={() => {
          setNewListDialog(false);
          setName("");
          setDate((date) => new Date());
        }}
        onShow={() => refFocusName.current.focus()}
        header={
          <>
            <i className="pi pi-plus" style={{ marginRight: ".5rem" }}></i>
            Create new list
          </>
        }
        message={
          <>
            <span
              className="p-input-icon-right"
              style={{
                display: "flex",
              }}
            >
              <i className="pi pi-book" />
              <InputText
                ref={refFocusName}
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
                  if (e.value) setDate(new Date(e.value.setHours(0, 0, 0)));
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
            </div>

            <p style={{ opacity: "0.8", fontSize: "0.8rem" }}>
              *If you set hours to 00:00 event will be setted for whole day!
            </p>
          </>
        }
        accept={() => {
          if (!name) {
            toastRef.current.show({
              severity: "error",
              summary: "Error",
              detail: "Name cannot be empty!",
              life: 5000,
            });
            return;
          }
          date.setSeconds(0);
          CreateList({
            listName: name,
            finishDate: date,
          })
            .then((res) => {
              toastRef.current.show({
                severity: "success",
                summary: "Success ",
                detail: res.message,
                life: 5000,
              });
              fetchData(res.data);
            })

            .catch((error) => {
              console.log(error);
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
        style={{ marginRight: "1rem" }}
        label="New"
        onClick={() => {
          setNewListDialog(true);
        }}
      />
    </>
  );
}

export default New;
