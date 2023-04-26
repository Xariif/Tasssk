import { Link } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { useNavigate } from "react-router-dom";
import { ToastAPI } from "../../context/ToastContext";
import useLocalStorage from "../../hooks/useLocalStorage";
import { LoginUser } from "../../services/UserService";
import { useAuthUpdateContext } from "../../context/AuthContext";
import { useToastContext } from "../../context/ToastContext";
import { Divider } from "primereact/divider";
import logo from "./../../logo.png";
import { Formik, useFormik, Form, Field, ErrorMessage } from "formik";
import { Password } from "primereact/password";

export default function Login() {
  const navigate = useNavigate();
  const [, setToken] = useLocalStorage("token", "");
  const [, setDarkMode] = useLocalStorage("darkMode", "");
  const [, setEmail] = useLocalStorage("email", "");
  const toastRef = useToastContext();
  const setAuth = useAuthUpdateContext();

  const validate = (data) => {
    let errors = {};
    if (!data.email) {
      errors.email = "Email is required.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
      errors.email = "Invalid email address. E.g. example@email.com";
    }
    if (!data.password) {
      errors.password = "Password is required.";
    }
    return errors;
  };

  return (
    <div
      style={{
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "900px",
          padding: "1rem",
          backgroundColor: "white",
          borderRadius: "var(--border-radius)",

          textAlign: "center",
        }}
      >
        <img
          src={logo}
          alt={"logo"}
          height={"30px"}
          style={{ margin: "1rem", marginBottom: "1rem" }}
        />
        <div
          className="flex flex-column md:flex-row"
          style={{ justifyContent: "space-between" }}
        >
          <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              onSubmit={async (data) => {
                LoginUser(data)
                  .then((res) => {
                    setToken(res.data.token);
                    setEmail(res.data.email);
                    setAuth(true);
                    setDarkMode(res.data.darkMode ? true : "");
                    navigate("/");
                  })
                  .catch((err) => {
                    ToastAPI(toastRef, err);
                  });
              }}
              validate={validate}
            >
              {(props) => (
                <Form>
                  <span
                    className="p-input-icon-right "
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: ".5rem 0 .5rem 0",
                    }}
                  >
                    <label
                      htmlFor="email"
                      style={{
                        userSelect: "none",
                        marginRight: ".5rem",
                        width: "6rem",
                      }}
                    >
                      E-mail
                    </label>
                    <i className="pi pi-envelope" />
                    <InputText
                      name="email"
                      type="text"
                      onChange={props.handleChange}
                      value={props.values.name}
                    />
                  </span>{" "}
                  <div style={{ height: "16px" }}>
                    <ErrorMessage
                      name="email"
                      component="small"
                      className="p-error"
                    />
                  </div>
                  <span
                    className="p-input-icon-right "
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      margin: ".5rem 0 .5rem 0",
                    }}
                  >
                    <label
                      htmlFor="password"
                      style={{
                        userSelect: "none",
                        marginRight: ".5rem",
                        width: "6rem",
                      }}
                    >
                      Password
                    </label>
                    <i className="pi pi-key" />
                    <InputText
                      type="password"
                      onChange={props.handleChange}
                      value={props.values.name}
                      name="password"
                    />
                  </span>
                  <div style={{ height: "16px" }}>
                    <ErrorMessage
                      name="password"
                      component="small"
                      className="p-error"
                    />
                  </div>
                  <Button
                    label="Login"
                    icon="pi pi-user"
                    className="w-10rem mx-auto"
                    type="submit"
                    style={{ display: "flex", marginTop: ".5rem" }}
                  ></Button>
                </Form>
              )}
            </Formik>
          </div>

          <div className="w-full md:w-2">
            <Divider layout="vertical" className="hidden md:flex">
              <b>OR</b>
            </Divider>
            <Divider
              layout="horizontal"
              className="flex md:hidden"
              align="center"
            >
              <b>OR</b>
            </Divider>
          </div>
          <div className="w-full md:w-5 flex align-items-center justify-content-center py-5">
            <Link
              to="/Register"
              children={
                <Button
                  label="Sign Up"
                  icon="pi pi-user-plus"
                  className="p-button-success"
                ></Button>
              }
            ></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
