import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";

import { Add } from "./Actions/Add";

import { DeleteFile, GetFile } from "../../../../../services/ToDoService";
import { useToastContext } from "../../../../../context/ToastContext";

export const File = ({ list, loadData }) => {
  const [fileDialog, setFileDialog] = useState(false);
  const toastRef = useToastContext();
  const actionsTemplate = (row) => {
    var fileId = row.fileId;
    var listId = list.id;

    return (
      <>
        <Button
          icon="pi pi-download "
          className="p-button-rounded p-button-outlined"
          onClick={() => {
            GetFile({ fileId }).then((res) => {
              var base64 =
                "data:" + row.type + ";base64," + res.data.fileString;
              fetch(base64)
                .then((res) => res.blob())
                .then((blob) => {
                  const url = window.URL.createObjectURL(new Blob([blob]));
                  const link = document.createElement("a");
                  link.href = url;
                  link.setAttribute("download", row.name);
                  document.body.appendChild(link);
                  link.click();
                  link.parentNode.removeChild(link);
                });
            });
          }}
        />
        <Button
          icon="pi pi-trash "
          style={{ marginLeft: "1rem" }}
          className="p-button-danger p-button-rounded p-button-outlined"
          onClick={() => {
            DeleteFile({ listId, fileId })
              .then(() => {
                toastRef.current.show({
                  severity: "error",
                  summary: "Deleted",
                });
                loadData();
              })
              .catch(() => {
                toastRef.current.show({
                  severity: "error",
                  summary: "Error",
                });
              });
          }}
        />
      </>
    );
  };

  return (
    <>
      <Dialog
        visible={fileDialog}
        draggable={false}
        style={{ width: "80%" }}
        header="Files manager"
        onHide={() => setFileDialog(false)}
      >
        <DataTable
          value={list.files}
          responsiveLayout="scroll"
          rowHover
          emptyMessage="No files"
          footer={
            <div style={{ display: "flex", justifyContent: "right" }}>
              <Add list={list} loadData={loadData} />
            </div>
          }
        >
          <Column field="name" header="Name" />
          <Column
            field="fileId"
            header="Actions"
            body={actionsTemplate}
            style={{ width: "126px" }}
          />
        </DataTable>
      </Dialog>
      <Button
        className="p-button-rounded p-button-info"
        label="Files"
        icon="pi pi-file"
        onClick={() => setFileDialog(true)}
      />
    </>
  );
};
