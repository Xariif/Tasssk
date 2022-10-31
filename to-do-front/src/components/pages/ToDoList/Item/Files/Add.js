import { FileUpload } from "primereact/fileupload";
import { useToastContext } from "../../../../../context/ToastContext";
import { useRef } from "react";
import { Tag } from "primereact/tag";
import { ProgressBar } from "primereact/progressbar";
import { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { AddFile } from "../../../../../services/ToDoService";
export const Add = ({ list }) => {
  const [uploadFileDialog, setUploadFileDialog] = useState(false);
  const toastRef = useToastContext();
  const fileUploadRef = useRef(null);

  const onTemplateRemove = (file, callback) => {
    callback();
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          {file.type === "image/svg+xml" || file.type === "image/jpeg" ? (
            <img
              alt={file.name}
              role="presentation"
              src={file.objectURL}
              width={100}
            />
          ) : null}

          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        />
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    label: "Add ",
    icon: "pi pi-plus",
    className:
      "custom-cancel-btn p-button-success p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    label: "Send ",
    icon: "pi pi-upload",
    className:
      "custom-cancel-btn p-button-warning p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    label: "Cancel",
    icon: "pi pi-fw pi-times",
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };
  const uploadHandler = (event) => {
    console.log("🚀 ~ file: Add.js ~ line 93 ~ uploadHandler ~ event", event);
    const body = {
      listId: list.id,
      files: event.files,
    };

    AddFile(body)
      .then((res) => {
        setUploadFileDialog(false);
        toastRef.current.show({
          severity: "info",
          summary: "Success",
          detail: "Uploaded",
        });
      })
      .catch(() => {
        toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Cannot upload files",
        });
      });
  };

  return (
    <>
      <Dialog
        visible={uploadFileDialog}
        draggable={false}
        onHide={() => setUploadFileDialog(false)}
        style={{ width: "50vw" }}
        header="Add files"
      >
        <FileUpload
          ref={fileUploadRef}
          itemTemplate={itemTemplate}
          emptyTemplate={emptyTemplate}
          chooseOptions={chooseOptions}
          uploadOptions={uploadOptions}
          cancelOptions={cancelOptions}
          multiple
          customUpload
          uploadHandler={uploadHandler}
          maxFileSize={1000000}
        />
      </Dialog>
      <Button
        label="Add Files"
        className="p-button-rounded p-button-warning"
        icon={"pi pi-file"}
        onClick={() => setUploadFileDialog(true)}
      />
    </>
  );
};
