import { useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { DeleteItem } from "../../../../../services/ToDoService";
import { Button } from "primereact/button";

export const Delete = ({ style, selectedItem, list, fetchData }) => {
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);

  function DeleteSelectedItem() {
    return new Promise((resolve, reject) => {
      const props = {
        listId: list.id,
        itemId: selectedItem.id,
      };

      DeleteItem(props)
        .then((res) => {
          fetchData();
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => {
          setDeleteItemDialog(false);
        });
    });
  }
  return (
    <>
      <ConfirmDialog
        visible={deleteItemDialog}
        draggable={false}
        header={"Delete item?"}
        onHide={() => {
          setDeleteItemDialog(false);
        }}
        focusOnShow
        style={{ wordBreak: "break-all", wordWrap: "break-word" }}
        icon="pi pi-trash"
        message={
          <div
            style={{
              marginLeft: "1rem",
            }}
          >
            {selectedItem.name}
          </div>
        }
        accept={(e) => {
          DeleteSelectedItem();
        }}
      />

      <Button
        className="p-button-rounded p-button-danger"
        icon="pi pi-trash"
        onClick={() => {
          setDeleteItemDialog(true);
        }}
        style={style}
      />
    </>
  );
};
