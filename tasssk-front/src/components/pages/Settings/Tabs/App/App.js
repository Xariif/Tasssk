import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { useToastContext } from "../../../../../context/ToastContext";
import { ChangeTheme } from "../../../../../services/UserService";
import { ScrollPanel } from "primereact/scrollpanel";
import PrimeReact from "primereact/api";
import useLocalStorage from "hooks/useLocalStorage";

export default function App() {
  const [reportDialog, setReportDialog] = useState(false);
  const toastRef = useToastContext();
  const [darkMode, setDarkMode] = useLocalStorage("darkMode");
  const [dakModeSwitch, setDarkModeSwitch] = useState(Boolean(darkMode));
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
          checked={dakModeSwitch}
          onChange={() => {
            ChangeTheme().then((res) => {
              PrimeReact.changeTheme(
                res.data ? "lara-light-blue" : "lara-dark-blue",
                res.data ? "lara-dark-blue" : "lara-light-blue",
                "theme-link",
                () => {}
              );
              res.data ? setDarkMode(true) : setDarkMode("");
              setDarkModeSwitch(res.data);
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
