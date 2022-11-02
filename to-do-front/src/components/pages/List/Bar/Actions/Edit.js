import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { useEffect } from "react";
import useLocalStorage from "../../../../../hooks/useLocalStorage";
import { useToastContext } from "../../../../../context/ToastContext";

import { EditList } from "../../../../../services/ToDoService";
import { Calendar } from "primereact/calendar";

export default function Delete({ selectedList, fetchData }) {
  const [storage, setStorage] = useLocalStorage("selectedList");
  console.log(selectedList);
  const toastRef = useToastContext();
  const [editListDialog, setEditListDialog] = useState(false);
  const [value, setValue] = useState();
  console.log(value);
  const [date, setDate] = useState();

  useEffect(() => {
    setValue(selectedList.name);
    setDate(new Date(selectedList.finishDate));
  }, [selectedList]);

  const exit = () => {
    setEditListDialog(false);
  };

  return (
    <>
      <Dialog
        visible={editListDialog}
        draggable={false}
        onHide={() => {
          exit();
        }}
        header={"Edit list"}
        footer={
          <div>
            <Button
              label="Discard"
              icon="pi pi-times"
              onClick={() => {
                exit();
              }}
              className="p-button-text"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={() => {
                selectedList.name = value;
                selectedList.finishDate = date;
                EditList(selectedList)
                  .then((res) => {
                    fetchData();
                    setStorage(value);
                    setEditListDialog(false);

                    toastRef.current.show({
                      severity: "info",
                      summary: "Edit",
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
                  .finally(() => exit());
              }}
              autoFocus
            />
          </div>
        }
      >
        <div
          style={{
            display: "flex",
            marginTop: "1rem",
            alignItems: "center",
          }}
        >
          <i
            className="pi pi-check-square"
            style={{ fontSize: "2rem", paddingRight: "1rem" }}
          />
          <InputText
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </div>{" "}
        <div
          style={{
            display: "flex",
            marginTop: "1rem",
            alignItems: "center",
          }}
        >
          <i
            className="pi pi-clock"
            style={{ fontSize: "2rem", paddingRight: "1rem" }}
          />
          <Calendar
            showTime
            value={date}
            onChange={(e) => setDate(new Date(e.value.setSeconds(0)))}
          />
        </div>
      </Dialog>
      <Button
        className="p-button-rounded p-button-warning"
        icon="pi pi-pencil"
        label="Edit"
        style={{ marginRight: "5px" }}
        onClick={() => setEditListDialog(true)}
      />
    </>
  );
}