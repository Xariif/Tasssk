import { FileUpload } from "primereact/fileupload";
import { ToastAPI, useToastContext } from "../../../../../../context/ToastContext";
import { useRef } from "react";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

import { ProgressBar } from "primereact/progressbar";
import { CreateFile } from "services/FileService";

export const Add = ({ fetchData, selectedData }) => {
  const [uploadFileDialog, setUploadFileDialog] = useState(false);
  const [uploadedPercent, setUploadedPecent] = useState(0);
  const [progressBar, setProgressBar] = useState(false);
  const fileUploadRef = useRef(null);
  const toastRef = useToastContext();
  const onTemplateRemove = (file, callback) => {
    callback();
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex justify-content-between align-items-center">
        <span className="flex flex-column text-left   text-overflow-ellipsis">
          <h5 style={{ margin: "0px" }}>{file.name}</h5>
          <small>{new Date(file.lastModifiedDate).toLocaleDateString()}</small>
        </span>
        <div className="flex justify-content-center">
          <Tag
            value={props.formatSize}
            severity="warning"
            className="px-3 py-2 mx-3 min-w-30 "
          />
          <Button
            type="button"
            icon="pi pi-times"
            className="p-button-outlined p-button-rounded p-button-danger"
            onClick={() => onTemplateRemove(file, props.onRemove)}
          />
        </div>
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
        ></i>
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
    setProgressBar(true);
    const body = {
      listId: selectedData.id,
      files: event.files,
    };
    CreateFile({ body, setUploadedPecent })
      .then((res) => {
        ToastAPI(toastRef, "File uploaded successfully");
        setUploadFileDialog(false);
      })
      .catch((err) => {
        ToastAPI(toastRef, err);
      })
      .finally(() => {
        setUploadedPecent(0);
        setProgressBar(false);
      });
  };

  return (
    <>
      <Dialog
        visible={uploadFileDialog}
        draggable={false}
        onHide={() => setUploadFileDialog(false)}
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
          maxFileSize={10000000}
        />
        {progressBar && (
          <div style={{ textAlign: "center" }}>
            Uploading
            <ProgressBar value={uploadedPercent} />
          </div>
        )}
      </Dialog>
      <Button
        label="Add"
        icon="pi pi-plus"
        className="p-button-rounded p-button-success"
        onClick={() => setUploadFileDialog(true)}
      />
    </>
  );
};
