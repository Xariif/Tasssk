import { useState } from "react";

import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";

import { DeleteList } from "../../../../../services/ToDoService";
import { useToastContext } from "../../../../../context/ToastContext";

export default function Delete({ selectedList, fetchData }) {
  const toastRef = useToastContext();
  const [deleteListDialog, setDeleteListDialog] = useState(false);
  return (
    <>
      <ConfirmDialog
        visible={deleteListDialog}
        draggable={false}
        onHide={() => setDeleteListDialog(false)}
        icon="pi pi-trash"
        header={"Delete list?"}
        message={
          <div
            style={{
              display: "flex",
              marginLeft: "1rem",
              marginTop: "1rem",
              alignItems: "center",
            }}
          >
            {selectedList.name}
          </div>
        }
        accept={() => {
          DeleteList(selectedList)
            .then((res) => {
              fetchData("del");
              toastRef.current.show({
                severity: "error",
                summary: "Deleted",
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
              fetchData();
            });
        }}
      />
      <Button
        className="p-button-rounded p-button-danger"
        icon="pi pi-trash"
        label="Delete"
        onClick={() => setDeleteListDialog(true)}
      />
    </>
  );
}
