import { useEffect, useRef, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { UpdateItem } from "services/ItemService";

export const Edit = ({ selectedItem, fetchData }) => {
  const inputRef = useRef();
  const [itemName, setItemName] = useState("");

  const [editItemDialog, setEditItemDialog] = useState(false);
  useEffect(() => {
    setItemName(selectedItem.name);
  }, [selectedItem]);

  function ChangeItemName() {
    return new Promise((resolve, reject) => {
      selectedItem.name = itemName;
      UpdateItem(selectedItem)
        .then((res) => {
          fetchData(selectedItem.istId);
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
        header={
          <>
            <i className="pi pi-pencil" style={{ marginRight: ".5rem" }}></i>
            Edit
          </>
        }     
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
                ChangeItemName().then(() => setEditItemDialog(false));
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
          cols={80}  
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
