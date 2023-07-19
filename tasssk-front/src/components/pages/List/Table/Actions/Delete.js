import { useState } from "react";
import { ConfirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { DeleteItem } from "services/ItemService";

export const Delete = ({ selectedItem, fetchData }) => {
  return (
    <>
      <Button
        className="p-button-rounded p-button-danger"
        icon="pi pi-trash"
        onClick={() => {
          DeleteItem(selectedItem)
            .then((res) => {
              fetchData(selectedItem.listId);
            })
            .catch((error) => {
              console.log(error);
            });
        }}
        style={{ marginLeft: "1rem" }}
      />
    </>
  );
};
