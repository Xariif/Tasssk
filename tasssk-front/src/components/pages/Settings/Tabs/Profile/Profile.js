import { useToastContext } from "../../../../../context/ToastContext";

import { useNavigate } from "react-router-dom";
import ChangePasswordButton from "./Actions/ChangePasswordButton";
import DeleteAccountButton from "./Actions/DeleteAccountButton";
export default function Profile() {
  const toastRef = useToastContext();
  const navigate = useNavigate();

  return (
    <>
      <div style={{ borderBottom: "1px solid #383838", padding: " 1rem 0px" }}>
        <h2>Password</h2>
        <h5 />
        <ChangePasswordButton />
      </div>
      <div>
        <h2>Account</h2>
        <DeleteAccountButton />
      </div>
    </>
  );
}
