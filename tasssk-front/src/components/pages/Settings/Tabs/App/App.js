import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { useToastContext } from "../../../../../context/ToastContext";
import { ChangeTheme } from "../../../../../services/UserService";
import { ScrollPanel } from "primereact/scrollpanel";

import {
  useThemeContext,
  useThemeUpdateContext,
} from "../../../../../context/ThemeContext";
export default function App() {
  const [reportDialog, setReportDialog] = useState();
  const toastRef = useToastContext();

  const ReportDialog = () => {
    function SendReport() {
      setReportDialog(false);

      return toastRef.current.show({
        severity: "success",
        summary: "Report send",
        detail: "Thank you for your feedback!",
        life: 5000,
      });
    }
    return (
      <Dialog
        onHide={() => setReportDialog(false)}
        style={{
          borderRadius: "2rem",
          border: "none",
          overflow: "hidden",
          textAlign: "center",
        }}
        className=" text-xl"
        visible={reportDialog}
        resizable={false}
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
              onClick={() => SendReport()}
              label="Send"
              icon={"pi pi-send"}
              iconPos="right"
            ></Button>
          </div>
        }
        header="Any problems? Let us know!"
      >
        <InputTextarea placeholder="Describe " autoResize rows={14} cols={50} />
      </Dialog>
    );
  };
  const theme = useThemeContext();

  const setDarkTheme = useThemeUpdateContext();
  return (
    <>
      <ReportDialog />
      <div
        style={{
          borderBottom: "1px solid #383838",
          padding: " 1rem 0px",
        }}
      >
        <h2 style={{ opacity: ".5" }}>Reminders - In progress</h2>
        <InputSwitch checked={false} disabled />
      </div>
      <div style={{ borderBottom: "1px solid #383838", padding: " 1rem 0px" }}>
        <h2>Dark mode?</h2>
        <InputSwitch
          checked={theme}
          onChange={() => {
            ChangeTheme().then((res) => {
              if (res.data === true) setDarkTheme(res.data);
              else setDarkTheme(false);
            });
          }}
        />
      </div>
      <div>
        <h2>Something wrong?</h2>

        <Button
          label="Report bug"
          icon="pi pi-send"
          iconPos="right"
          className="p-button-rounded p-button-danger"
          onClick={() => setReportDialog(true)}
        />
      </div>
    </>
  );
}
