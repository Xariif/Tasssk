import { Link } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { classNames } from "primereact/utils";
import { Form, Field } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { ToastAPI } from "../../../context/ToastContext";
import logo from "./../../../logo.png";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { LoginUser } from "../../../services/UserService";
import { useAuthUpdateContext } from "../../../context/AuthContext";
import { useThemeUpdateContext } from "../../../context/ThemeContext";
import { useToastContext } from "../../../context/ToastContext";


export default function Login() {
  const navigate = useNavigate();
  const [, setToken] = useLocalStorage("token", "");
  const [, setEmail] = useLocalStorage("email", "");

  const toastRef = useToastContext();
  const setTheme = useThemeUpdateContext();
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

  async function onSubmit(data, form) {
    LoginUser(data)
      .then((res) => {
        setToken(res.data.token);
        setEmail(res.data.email);
        setAuth(true);
        setTheme(res.data.darkMode);
        navigate("/");
      })
      .catch((err) => {
        ToastAPI(toastRef, err);
      });
  }

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          minWidth: "350px",
          justifyContent: "center",
          backgroundColor: "#f3c21e",
          padding: "2rem",
          borderRadius: "10px",
          border: "1px solid var(--text-color)",
        }}
      >
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <img src={logo} alt={"logo"} height={"30px"} />
        </div>
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          Login
        </div>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            email: "test@test.pl",
            password: "12345678",
            logedIn: false,
          }}
          validate={validate}
          render={({ handleSubmit }) => (
            <form
              onSubmit={handleSubmit}
              className="p-fluid"
              style={{ marginTop: "2rem" }}
            >
              <Field
                style={{ marginBottom: "1rem" }}
                name="email"
                render={({ input, meta }) => (
                  <div className="field">
                    <span className="p-float-label p-input-icon-right">
                      <i className="pi pi-envelope" />
                      <InputText
                        id="email"
                        {...input}
                        className={classNames({
                          "p-invalid": isFormFieldValid(meta),
                        })}
                      />
                      <label
                        htmlFor="email"
                        className={classNames({
                          "p-error": isFormFieldValid(meta),
                        })}
                      >
                        Email
                      </label>
                    </span>
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                style={{ marginBottom: "1rem" }}
                name="password"
                render={({ input, meta }) => (
                  <div className="field">
                    <span className="p-float-label">
                      <Password
                        id="password"
                        {...input}
                        toggleMask
                        feedback={false}
                        className={classNames({
                          "p-invalid": isFormFieldValid(meta),
                        })}
                      />
                      <label
                        htmlFor="password"
                        className={classNames({
                          "p-error": isFormFieldValid(meta),
                        })}
                      >
                        Password
                      </label>
                    </span>
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Button type="submit" label="Sign in" className="mt-2" />
            </form>
          )}
        />
        <div style={{ marginTop: "1rem", textAlign: "center" }}>
          Don't have account?{" "}
          <Link to="/Register" style={{ textDecoration: "none" }}>
            Create today!
          </Link>
        </div>
      </div>
    </div>
  );
}
