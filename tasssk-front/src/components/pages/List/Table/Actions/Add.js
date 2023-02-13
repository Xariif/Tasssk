import { useState, useRef } from "react";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

import { AddItem } from "../../../../../services/ToDoService";

export const Add = ({ list, fetchData, style }) => {
  const [value, setValue] = useState("");
  const refFocusName = useRef(null);
  const [addItemDialog, setAddItemDialog] = useState(false);

  function AddNewItem() {
    return new Promise((resolve, reject) => {
      const props = {
        listId: list.id,
        itemName: value,
      };
      AddItem(props)
        .then((res) => {
          setAddItemDialog(false);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => fetchData());
    });
  }
  return (
    <div style={style}>
      <Dialog
        visible={addItemDialog}
        draggable={false}
        header={"Add item to list"}
        onHide={() => {
          setAddItemDialog(false);
          setValue("");
        }}
        onShow={() => refFocusName.current.focus()}
        footer={
          <>
            <Button
              label="Discard"
              className=" p-button-text"
              icon="pi pi-times"
              onClick={() => {
                setAddItemDialog(false);
                setValue("");
              }}
            />
            <Button
              label="Add"
              className=" p-button-accept"
              icon="pi pi-check"
              onClick={() => {
                AddNewItem();
                setValue("");
              }}
            />
          </>
        }
      >
        <InputTextarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={5}
          cols={30}
          ref={refFocusName}
          autoResize
        />
      </Dialog>{" "}
      <Button
        className="p-button-rounded p-button-success"
        icon="pi pi-plus"
        label="Add item "
        onClick={() => setAddItemDialog(true)}
      />
    </div>
  );
};
