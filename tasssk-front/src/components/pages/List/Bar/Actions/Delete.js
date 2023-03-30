import { useState } from "react";

import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";

import { DeleteList } from "../../../../../services/ListService";
import { useToastContext } from "../../../../../context/ToastContext";
import useLocalStorage from "hooks/useLocalStorage";

export default function Delete({ fetchData, selectedData }) {
  const toastRef = useToastContext();
  const [deleteListDialog, setDeleteListDialog] = useState(false);
  const [listStorage, setListStorage] = useLocalStorage("selectedList");

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
            {selectedData.list.name}
          </div>
        }
        accept={() => {
          DeleteList(selectedData.list)
            .then((res) => {
              toastRef.current.show({
                severity: "error",
                summary: "Deleted",
                detail: res.message,
                life: 5000,
              });
              setListStorage("");
              fetchData("delete");
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
