import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { useState } from "react";
import Countdown from "react-countdown";
import { useNavigate } from "react-router-dom";
import { useToastContext } from "../../../../../../context/ToastContext";
import { DeleteAccount } from "../../../../../../services/UserService";

export default function DeleteAccountButton() {
  const [deleteDialog, setDeleteDialog] = useState();

  const DialogDelete = () => {
    const Delete = () => {
      const [password, setPassword] = useState("");
      const toastRef = useToastContext();
      const navigate = useNavigate();
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
          <Password
            placeholder="Password"
            style={{ marginRight: "1rem" }}
            inputStyle={{ borderRadius: "1rem" }}
            feedback={false}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            label="Delete"
            iconPos="right"
            icon="pi pi-trash"
            className="p-button-rounded p-button-danger"
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
          borderRadius: "1rem",
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
        contentStyle={{
          display: "flex",
          justifyContent: "center",
          padding: "1rem",
          alignItems: "center",
        }}
        onHide={() => setDeleteDialog(false)}
        header={"Waring!"}
        footer={
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            {" "}
            <Countdown date={Date.now() + 1000} daysInHours>
              <Delete />
            </Countdown>
          </div>
        }
      >
        <i
          className="pi pi-exclamation-triangle"
          style={{ fontSize: "3rem" }}
        />
        <p style={{ marginLeft: "1rem", textAlign: "center" }}>
          Are you sure you want to pernamentally delete your account?
          <br />
          You will lose all saved data!
        </p>
      </Dialog>
    );
  };
  return (
    <>
      <DialogDelete />
      <Button
        label="Delete "
        icon="pi pi-trash"
        iconPos="right"
        className="p-button-rounded p-button-danger"
        onClick={() => setDeleteDialog(true)}
      />
    </>
  );
}
