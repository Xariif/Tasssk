import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Checkbox } from "primereact/checkbox";

export default function Privilages({ list }) {
  const [dialogVisible, setDialogVisible] = useState(false);

  console.log(list);
  const access = [
    {
      name: "marek",
      owner: true,
      read: true,
      write: true,
      delete: true,
      modify: true,
    },
    {
      name: "klaudia",
      owner: false,
      read: true,
      write: false,
      delete: false,
      modify: false,
    },
    {
      name: "kuba",
      owner: false,
      read: true,
      write: false,
      delete: false,
      modify: true,
    },
    {
      name: "maciek",
      owner: false,
      read: true,
      write: true,
      delete: false,
      modify: false,
    },
  ];

  return (
    <>
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        draggable={false}
        resizable={false}
        style={{ width: "90%" }}
        header={
          <>
            <i className="pi pi-lock" style={{ marginRight: ".5rem" }}></i>
            Privilages
          </>
        }
      >
        <DataTable value={access} paginator rows={5} footer={<Button></Button>}>
          <Column
            field="name"
            header="E-mail"
            body={(user) => {
              if (user.owner)
                return <div style={{ color: "red" }}>{user.name}</div>;
              return user.name;
            }}
          ></Column>
          <Column
            field="read"
            header="Read"
            dataType="boolean"
            body={(user) => {
              return (
                <Checkbox disabled={user.owner} checked={user.read}></Checkbox>
              );
            }}
          ></Column>
          <Column
            field="write"
            header="Write"
            dataType="boolean"
            body={(user) => {
              return <Checkbox disabled checked={user.write}></Checkbox>;
            }}
          ></Column>
          <Column
            field="modify"
            header="Modify"
            dataType="boolean"
            body={(user) => {
              return <Checkbox disabled checked={user.modify}></Checkbox>;
            }}
          ></Column>
          <Column
            field="delete"
            header="Delete"
            dataType="boolean"
            body={(user) => {
              return <Checkbox disabled checked={user.delete}></Checkbox>;
            }}
          ></Column>
          <Column
            field="actions"
            header="Actions"
            dataType="boolean"
            body={(user) => {
              return (
                <div>
                  <Button> Delete</Button>
                </div>
              );
            }}
          ></Column>
        </DataTable>
      </Dialog>

      <Button
        className="p-button-rounded p-button-success"
        icon="pi pi-lock"
        label="Privilages "
        onClick={() => {
          setDialogVisible(true);
        }}
      />
    </>
  );
}
