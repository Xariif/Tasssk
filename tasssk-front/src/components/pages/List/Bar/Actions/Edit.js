import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { useEffect } from "react";
import useLocalStorage from "../../../../../hooks/useLocalStorage";
import { useToastContext } from "../../../../../context/ToastContext";
import { UpdateList } from "../../../../../services/ListService";
import { Calendar } from "primereact/calendar";

export default function Edit({ fetchData, selectedData }) {
  const [listStorage, setListStorage] = useLocalStorage("selectedList");
  const [emailStorage] = useLocalStorage("email");
  const refFocusName = useRef(null);

  const toastRef = useToastContext();
  const [editListDialog, setEditListDialog] = useState(false);
  const [value, setValue] = useState("");
  const [date, setDate] = useState(null);

  useEffect(() => {
    setValue(selectedData.name);
    setDate(new Date(selectedData.finishDate));
  }, [selectedData.list]);

  return (
    <>
      <Dialog
        visible={editListDialog}
        draggable={false}
        onHide={() => {
          setEditListDialog(false);
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
                setEditListDialog(false);
              }}
              className="p-button-text"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={() => {
                if (!value) {
                  toastRef.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Name cannot be empty!",
                    life: 5000,
                  });
                  return;
                }
                date.setSeconds(0);
                selectedData.name = value;
                selectedData.finishDate = date;
                UpdateList(selectedData)
                  .then((res) => {
                    setListStorage(value);
                    setEditListDialog(false);
                    fetchData(selectedData.id);

                    toastRef.current.show({
                      severity: "info",
                      summary: "Edit",
                      detail: "List updated",
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
                  .finally(() => setEditListDialog(false));
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
              setValue((prev) => e.target.value);
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
            onChange={(e) => {
              if (e.value) setDate(e.value);
            }}
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
