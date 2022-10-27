import { React, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { classNames } from "primereact/utils";
import { Form, Field } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";

import useLocalStorage from "../../../hooks/useLocalStorage";

import { LoginUser } from "../../../services/UserService";
import {
  useAuthContext,
  useAuthUpdateContext,
} from "../../../context/AuthContext";
import { useThemeUpdateContext } from "../../../context/ThemeContext";
import { useToastContext } from "../../../context/ToastContext";

import "./Login.scss";

export default function Login() {
  const navigate = useNavigate();
  const [token, setToken] = useLocalStorage("token", "");
  const toastRef = useToastContext();

  const setTheme = useThemeUpdateContext();
  const setAuth = useAuthUpdateContext();
  const auth = useAuthContext();

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
    try {
      await LoginUser(data).then((res) => {
        setToken(res.token);
        console.log(
          "🚀 ~ file: Login.js ~ line 52 ~ awaitLoginUser ~ res",
          res
        );

        setAuth(true);
        //  setTheme(res.darkMode);

        toastRef.current.show({
          severity: "success",
          summary: "Success ",
          detail: "Loged in!",
          life: 5000,
        });
      });

      navigate("/");
    } catch (error) {
      toastRef.current.show({
        severity: "error",
        summary: "Error",
        detail: "Wrong email or password",
        life: 5000,
      });
    }
  }

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  return (
    <div className="Login">
      <div className="Card">
        <div
          style={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
          }}
        >
          To Do Login
        </div>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            email: "Test1@wp.pl",
            password: "qwe",
            logedIn: false,
          }}
          validate={validate}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="p-fluid">
              <Field
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
              <Button type="submit" label="Submit" className="mt-2" />
            </form>
          )}
        />
        <div style={{ marginTop: "1rem" }}>
          Don't have account?
          <br />
          Register{" "}
          <Link to="/Register" style={{ textDecoration: "none" }}>
            here!
          </Link>
        </div>
      </div>
    </div>
  );
}
