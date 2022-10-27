import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { useToastContext } from "../../../../context/ToastContext";
export default function App() {
  const [reportDialog, setReportDialog] = useState();
  const toastRef = useToastContext();

  const ReportDialog = () => {
    function SendReport() {
      setReportDialog(false);

      return toastRef.current.show({
        severity: "success",
        summary: "Report send",
        detail: "Thank you for your help!",
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
            >
              &nbsp; <i className="pi pi-send" />
            </Button>
          </div>
        }
        header="Any problems? Let us know"
      >
        <InputTextarea rows={8} cols={30} />
      </Dialog>
    );
  };

  return (
    <>
      <ReportDialog />
      <div style={{ borderBottom: "1px solid #383838", padding: " 1rem 0px" }}>
        <h2>Reminders</h2>
        <InputSwitch checked={false} disabled />
      </div>
      <div style={{ borderBottom: "1px solid #383838", padding: " 1rem 0px" }}>
        <h2>Dark mode?</h2>
        <InputSwitch checked={false} disabled />
      </div>
      <div>
        <h2>Something wrong?</h2>

        <Button
          label="Report bug"
          className="p-button-rounded p-button-danger"
          onClick={() => setReportDialog(true)}
        />
      </div>
    </>
  );
}
