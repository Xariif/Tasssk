import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { useEffect } from "react";
import useLocalStorage from "../../../../../hooks/useLocalStorage";
import { useToastContext } from "../../../../../context/ToastContext";

import { EditList } from "../../../../../services/ToDoService";
import { Calendar } from "primereact/calendar";

export default function Delete({ list, loadData }) {
  const [storage, setStorage] = useLocalStorage("selectedList");
  const refFocusName = useRef(null);

  const toastRef = useToastContext();
  const [editListDialog, setEditListDialog] = useState(false);
  const [value, setValue] = useState();
  const [date, setDate] = useState();

  useEffect(() => {
    setValue(list.name);
    setDate(new Date(list.finishDate));
  }, [list]);

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
        header={
          <>
            <i className="pi pi-pencil" style={{ marginRight: ".5rem" }}></i>
            Edit list
          </>
        }
        onShow={() => refFocusName.current.focus()}
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
                list.name = value;
                list.finishDate = date;
                EditList(list)
                  .then((res) => {
                    loadData();
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
        <span
          className="p-input-icon-right"
          style={{
            display: "flex",
          }}
        >
          <i className="pi pi-book" />
          <InputText
            style={{ width: "100%" }}
            ref={refFocusName}
            placeholder="Name"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
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
            showTime
            showIcon
            value={date}
            onChange={(e) => setDate(new Date(e.value.setSeconds(0)))}
          />
        </div>
      </Dialog>
      <Button
        className="p-button-rounded p-button-warning"
        icon="pi pi-pencil"
        label="Edit"
        style={{ marginRight: "1rem" }}
        onClick={() => setEditListDialog(true)}
      />
    </>
  );
}
