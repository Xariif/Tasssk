import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useContext, useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { ToastAPI, useToastContext } from "context/ToastContext";
import { NotificationContext } from "context/NotificationContext";
import { ListPrivileges, RemoveAccess, SendInvite } from "services/ListService";
import { useAPI } from "hooks/useAPI";

export default function Privilages({ selectedList }) {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [email, setEmail] = useState("");
  const toastRef = useToastContext();
  const { send } = useContext(NotificationContext);
  const [SginalRnotifications, SginalRsendNotification] = send;
  const [privileges, setPrivileges] = useState([]);
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
              SendInvite({ email, selectedList })
                .then((res) => {
                  ToastAPI(toastRef, res);
                  res.status === 200 &&
                    SginalRsendNotification(email, res.data);
                })
                .catch((err) => {
                  ToastAPI(toastRef, err);
                });
            }
          }}
        ></Button>
      </div>
    );
  };

  useEffect(() => {
    ListPrivileges(selectedList.id).then((res) => {
      setPrivileges(res.data);
    });
  }, []);

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
        <DataTable value={privileges} paginator rows={8} footer={footer}>
          <Column
            field="email"
            header="E-mail"
            body={(user) => {
              return <>{user.email}</>;
            }}
          ></Column>
          <Column
            field="actions"
            header="Actions"
            dataType="boolean"
            style={{ width: "126px" }}
            body={(user) => {
              return user.isOwner ? (
                <div style={{ color: "red", textAlign: "center" }}>Owner</div>
              ) : (
                <div>
                  <Button
                    disabled
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-pencil"
                  ></Button>
                  <Button
                    disabled={user.isOwner}
                    className="p-button-rounded p-button-danger"
                    icon="pi pi-trash"
                    style={{ marginLeft: "1rem" }}
                    onClick={() => {
                      RemoveAccess(selectedList.id, user.email)
                        .then((res) => {
                          ToastAPI(toastRef, res);
                          setPrivileges(
                            privileges.filter((u) => u.email !== user.email)
                          );
                          res.status === 200 &&
                            SginalRsendNotification(user.email, res.data);
                        })
                        .catch((err) => {
                          ToastAPI(toastRef, err);
                        });
                    }}
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
