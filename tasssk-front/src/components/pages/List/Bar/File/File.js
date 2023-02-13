import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useState } from "react";

import { Add } from "./Actions/Add";

import { DeleteFile, GetFile } from "../../../../../services/ToDoService";
import { ToastAPI, useToastContext } from "../../../../../context/ToastContext";

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
              .then((res) => {
                ToastAPI(toastRef, res);
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

  const dateCreatedTemplate = (file) => {
    var timestamp = file.id.toString().substring(0, 8);
    var date = new Date(parseInt(timestamp, 16) * 1000);
    return <>{date.toLocaleString()}</>;
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
          rowHover
          paginator
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink  "
          rows={7}
          value={list.files}
          responsiveLayout="scroll"
          emptyMessage="No files"
          footer={
            <div style={{ display: "flex", justifyContent: "right" }}>
              <Add list={list} loadData={loadData} />
            </div>
          }
        >
          <Column field="name" header="Name" />
          <Column field="id" header="Upload date" body={dateCreatedTemplate} />
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
