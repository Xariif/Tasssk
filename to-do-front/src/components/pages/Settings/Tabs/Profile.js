import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import Countdown from "react-countdown";
import { Password } from "primereact/password";
import { ChangeTheme, DeleteAccount } from "./../../../../services/UserService";
import { useToastContext } from "./../../../../context/ToastContext";

import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [deleteDialog, setDeleteDialog] = useState();
  const [changePasswordDialog, setChangePasswordDialog] = useState();

  const toastRef = useToastContext();
  const navigate = useNavigate();

  const DialogChangePassword = () => {
    const [passOld, setPassOld] = useState("");
    const [passNew, setPassNew] = useState("");
    function ChangePass() {
      if (
        passOld.trim() === "" ||
        passNew.trim() === "" ||
        passNew.length < 8
      ) {
        setPassOld("");
        setPassNew("");

        return toastRef.current.show({
          severity: "error",
          summary: "Error",
          detail: "Write correct passwords!",
          life: 5000,
        });
      }

      return toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password changed!",
        life: 5000,
      });
    }

    const footer = (
      <>
        <Divider />
        <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
          <li>Minimum 8 characters</li>
        </ul>
      </>
    );

    return (
      <Dialog
        onHide={() => setChangePasswordDialog(false)}
        style={{
          borderRadius: "2rem",
          border: "none",
          overflow: "hidden",
          textAlign: "center",
        }}
        className=" text-xl"
        visible={changePasswordDialog}
        draggable={false}
        headerStyle={{ display: "flex", justifyContent: "space-between" }}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "right",
            }}
          >
            <Button
              className="p-button-rounded p-button-success"
              onClick={() => {
                ChangePass();
              }}
            >
              Save
            </Button>
          </div>
        }
        header={<>Change password!</>}
      >
        <div
          style={{
            padding: "1rem",
            display: "block",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <i
              className="pi pi-key"
              style={{
                fontSize: "1.5em",
                marginRight: "1rem",
              }}
            />
            <Password
              value={passOld}
              feedback={false}
              onChange={(e) => setPassOld(e.target.value)}
              placeholder="Old Password"
              toggleMask
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <i
              className="pi pi-key"
              style={{ fontSize: "1.5em", marginRight: "1rem" }}
            />
            <Password
              value={passNew}
              onChange={(e) => setPassNew(e.target.value)}
              placeholder="New Password"
              toggleMask
              footer={footer}
            />
          </div>
        </div>
      </Dialog>
    );
  };

  const DialogDelete = () => {
    const Delete = () => {
      const [password, setPassword] = useState("");

      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <i
            className="pi pi-key"
            style={{ fontSize: "1.5em", marginRight: "1rem" }}
          />
          <Password
            placeholder="Password"
            style={{ marginRight: "1rem" }}
            feedback={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            label="Delete"
            icon="pi pi-trash"
            className="bg-pink-800  p-button-rounded border-none"
            onClick={() => {
              DeleteAccount(password)
                .then((res) => {
                  if (res) {
                    toastRef.current.show({
                      severity: "success",
                      summary: "Success",
                      detail: "Your account has been deleted",
                      life: 5000,
                    });
                    window.localStorage.clear();
                    navigate("/Login");
                  } else {
                    toastRef.current.show({
                      severity: "error",
                      summary: "Error",
                      detail: "Wrong password entered",
                      life: 5000,
                    });
                  }
                })
                .catch((err) => {
                  toastRef.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: err.message,
                    life: 5000,
                  });
                });
            }}
          />
        </div>
      );
    };

    return (
      <Dialog
        style={{
          borderRadius: "2rem",
          border: "none",
          overflow: "hidden",
          textAlign: "center",
        }}
        className=" text-white font-bold  text-2xl"
        visible={deleteDialog}
        draggable={false}
        headerStyle={{
          display: "flex",
          justifyContent: "space-between",
          color: "red",
          fontSize: "35rem",
        }}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {" "}
            <Countdown date={Date.now() + 10000} daysInHours>
              <Delete />
            </Countdown>
          </div>
        }
        onHide={() => setDeleteDialog(false)}
        header={"Waring!"}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            padding: "1rem",
            alignItems: "center",
          }}
        >
          <i
            className="pi pi-exclamation-triangle"
            style={{ fontSize: "3rem" }}
          />
          <p style={{ marginLeft: "1rem", textAlign: "center" }}>
            {" "}
            Are you sure you want to pernamentally delete your account?
            <br />
            You will lose all saved data!
          </p>
        </div>
      </Dialog>
    );
  };

  return (
    <>
      <DialogChangePassword />
      <DialogDelete />
      <div style={{ borderBottom: "1px solid #383838", padding: " 1rem 0px" }}>
        <h2>Change password</h2>
        <Button
          label="Change password"
          className="p-button-rounded p-button-warning"
          onClick={() => setChangePasswordDialog(true)}
        />
      </div>

      <div>
        <h2>Delete account</h2>
        <Button
          label="Delete"
          className="p-button-rounded p-button-danger"
          onClick={() => setDeleteDialog(true)}
        />
      </div>
    </>
  );
}
