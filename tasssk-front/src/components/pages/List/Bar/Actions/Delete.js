import { useState } from "react";

import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";

import { DeleteList } from "../../../../../services/ListService";
import { useToastContext } from "../../../../../context/ToastContext";
import useLocalStorage from "hooks/useLocalStorage";

export default function Delete({ fetchData, selectedData }) {
  const toastRef = useToastContext();
  const [deleteListDialog, setDeleteListDialog] = useState(false);
  return (
    <>
      <ConfirmDialog
        visible={deleteListDialog}
        draggable={false}
        onHide={() => setDeleteListDialog(false)}
        header={
          <>
            <i className="pi pi-trash" style={{ marginRight: ".5rem" }}></i>
            Delete list?
          </>
        }
        message={
          <div
            style={{
              marginLeft: "1rem",
            }}
          >
            {selectedData.name}
          </div>
        }
        accept={() => {
          DeleteList(selectedData)
            .then((res) => {
              toastRef.current.show({
                severity: "error",
                summary: "Deleted",
                detail: "List deleted",
                life: 5000,
              });
              fetchData();
            })
            .catch((error) => {
              toastRef.current.show({
                severity: "error",
                summary: "Error",
                detail: "Something went wrong",
                life: 5000,
              });
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
