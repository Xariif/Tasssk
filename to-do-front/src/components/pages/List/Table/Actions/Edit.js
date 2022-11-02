import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

import { UpdateItem } from "../../../../../services/ToDoService";
export const Edit = ({ selectedItem, list, fetchData }) => {
  const inputRef = useRef();
  const [itemName, setItemName] = useState();
  const [editItemDialog, setEditItemDialog] = useState(false);
  useEffect(() => {
    setItemName(selectedItem.name);
  }, [selectedItem]);

  function ChangeItemName() {
    return new Promise((resolve, reject) => {
      const props = {
        listId: list.id,
        item: {
          id: selectedItem.id,
          name: itemName,
          finished: selectedItem.finished,
          createdAt: selectedItem.createdAt,
        },
      };

      UpdateItem(props)
        .then((res) => {
          fetchData();
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return (
    <>
      <Dialog
        visible={editItemDialog}
        draggable={false}
        header={"Edit"}
        onShow={() => inputRef.current.focus()}
        onHide={() => setEditItemDialog(false)}
        footer={
          <div>
            <Button
              label="Discard"
              icon="pi pi-times"
              onClick={() => setEditItemDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Save"
              icon="pi pi-check"
              onClick={() => {
                ChangeItemName();
              }}
              autoFocus
            />
          </div>
        }
      >
        <InputTextarea
          ref={inputRef}
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          onFocus={(e) =>
            e.currentTarget.setSelectionRange(
              e.currentTarget.value.length,
              e.currentTarget.value.length
            )
          }
          rows={5}
          cols={30}
          autoResize
        />
      </Dialog>
      <Button
        className="p-button-rounded p-button-warning"
        icon="pi pi-pencil"
        onClick={() => {
          setEditItemDialog(true);
        }}
      />
    </>
  );
};
