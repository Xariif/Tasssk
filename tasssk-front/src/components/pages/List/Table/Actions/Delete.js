import { useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { DeleteItem } from "services/ItemService";

export const Delete = ({ style, selectedItem, list, fetchData }) => {
  const [deleteItemDialog, setDeleteItemDialog] = useState(false);

  function DeleteSelectedItem() {
    return new Promise((resolve, reject) => {
      DeleteItem(selectedItem)
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
        header={
          <>
            <i className="pi pi-trash" style={{ marginRight: ".5rem" }}></i>
            Delete item?
          </>
        }
        onHide={() => {
          setDeleteItemDialog(false);
        }}
        focusOnShow
        style={{ wordBreak: "break-all", wordWrap: "break-word" }}
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
