import { useState, useRef, useEffect } from "react";

import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { CreateItem } from "services/ItemService";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";

export const Add = ({ list, fetchData }) => {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  const [addItemDialog, setAddItemDialog] = useState(false);
  function Add() {
    return new Promise((resolve, reject) => {
      const props = {
        ListId: list.id,
        Name: value,
      };
      CreateItem(props)
        .then((res) => {
          setAddItemDialog(false);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        })
        .finally(() => fetchData(list.id));
    });
  }

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <InputText
        style={{
          borderRadius: "2rem",
          marginRight: "1rem",
          width: "calc(100%)",
        }}
        placeholder="Name"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        ref={inputRef}
        onLoad={() => inputRef.current.focus()}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            setValue("");
            if (value.trim() !== "") Add();
          }
        }}
      ></InputText>
      <Button
        className="p-button-rounded p-button-success"
        icon="pi pi-plus"
        label="Add"
        onClick={() => {
          setValue("");
          if (value.trim() !== "") Add();
        }}
      />
    </div>
  );
};
