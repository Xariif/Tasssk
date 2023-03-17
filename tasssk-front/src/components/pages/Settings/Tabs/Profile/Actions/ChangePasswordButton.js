import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { useState } from "react";
import { useToastContext } from "../../../../../../context/ToastContext";
import { ChangePassword } from "../../../../../../services/UserService";
import { Divider } from "primereact/divider";

export default function ChangePasswordButton() {
  const [changePasswordDialog, setChangePasswordDialog] = useState();
  const toastRef = useToastContext();

  const DialogChangePassword = () => {
    const [passOld, setPassOld] = useState("");
    const [passNew, setPassNew] = useState("");
    function ChangePass() {
      if (
        passNew.trim() === "" ||
        passOld.trim() === "" ||
        passNew.length < 8
      ) {
        return toastRef.current.show({
          severity: "warn",
          summary: "Warning",
          detail: "Write correct values!",
          life: 5000,
        });
      }

      ChangePassword({ passOld, passNew });

      setPassOld("");
      setPassNew("");

      return toastRef.current.show({
        severity: "success",
        summary: "Success",
        detail: "Password changed!",
        life: 5000,
      });
    }

    return (
      <Dialog
        onHide={() => setChangePasswordDialog(false)}
        style={{
          borderRadius: "2rem",
          border: "none",
          overflow: "hidden",
          textAlign: "center",
        }}
        contentStyle={{ display: "flex", flexDirection: "column" }}
        className=" text-xl"
        visible={changePasswordDialog}
        draggable={false}
        headerStyle={{ display: "flex", justifyContent: "space-between" }}
        header={<>Change password</>}
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
              label={"Save"}
            />
          </div>
        }
      >
        <Password
          //  style={{ paddingBottom: "1rem" }}
          value={passOld}
          feedback={false}
          onChange={(e) => setPassOld(e.target.value)}
          placeholder="Old Password"
          toggleMask
        />
        <br />
        <Password
          value={passNew}
          onChange={(e) => setPassNew(e.target.value)}
          placeholder="New Password"
          toggleMask
          footer={
            <>
              <Divider />
              <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
                <li>Minimum 8 characters</li>
              </ul>
            </>
          }
        />
      </Dialog>
    );
  };

  return (
    <>
      <DialogChangePassword />
      <Button
        icon="pi pi-key"
        iconPos="right"
        label="Change password"
        className="p-button-rounded p-button-warning"
        onClick={() => setChangePasswordDialog(true)}
      />
    </>
  );
}
