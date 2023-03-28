import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import {
  GetUserPrivilages,
  GetUsersListPrivilages,
  SendInviteToList,
} from "services/ToDoService";
import { ToastAPI, useToastContext } from "context/ToastContext";
import { NotificationContext } from "context/NotificationContext";

export default function Privilages({ list, privileges }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [email, setEmail] = useState("");
  const toastRef = useToastContext();
  const { send } = useContext(NotificationContext);
  const [SginalRnotifications, SginalRsendNotification] = send;

  const [usersPrivilages, setUserPrivilages] = useState([]);
  useEffect(() => {
    GetUsersListPrivilages(list.id).then((res) => {
      setUserPrivilages(
        res.data.sort((a, b) => {
          return a === b ? 0 : a ? -1 : 1;
        })
      );
    });
  }, []);

  const footer = (options) => {
    return (
      <div style={{ textAlign: "right" }}>
        <InputText
          style={{ borderRadius: "2rem" }}
          placeholder="E-mail address"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        ></InputText>
        <Button
          style={{ marginLeft: "1rem" }}
          className="p-button-rounded p-button-success"
          icon="pi pi-send"
          label="Send"
          disabled={email === ""}
          onClick={() => {
            if (email) {
              setEmail("");
              SendInviteToList({ list, email })
                .then((res) => {
                  ToastAPI(toastRef, res);
                  return res;
                })
                .then((res) => {
                  console.log(res);
                  res.code === 200 &&
                    SginalRsendNotification(email, res.message);
                });
            }
          }}
        ></Button>
      </div>
    );
  };

  return (
    <>
      <Dialog
        visible={dialogVisible}
        onHide={() => setDialogVisible(false)}
        draggable={false}
        resizable={false}
        style={{ width: "80%" }}
        header={
          <>
            <i className="pi pi-lock" style={{ marginRight: ".5rem" }}></i>
            Privilages
          </>
        }
      >
        <DataTable value={usersPrivilages} paginator rows={8} footer={footer}>
          <Column
            field="email"
            header="E-mail"
            body={(user) => {
              if (user.owner)
                return <div style={{ color: "red" }}>{user.email}</div>;
              return user.email;
            }}
          ></Column>
          {/*
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
       

          */}
          <Column
            field="actions"
            header="Actions"
            dataType="boolean"
            style={{ width: "108px" }}
            body={(user) => {
              return user.owner ? (
                <div style={{ color: "red", textAlign: "center" }}>Owner</div>
              ) : (
                <div>
                  <Button
                    disabled
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-pencil"
                  ></Button>
                  <Button
                    disabled={user.owner}
                    className="p-button-rounded p-button-danger"
                    icon="pi pi-trash"
                    style={{ marginLeft: "1rem" }}
                  ></Button>
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
