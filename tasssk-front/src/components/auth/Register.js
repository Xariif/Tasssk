import React from "react";
import { Link, useNavigate } from "react-router-dom";

import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import logo from "./../../logo.png";
import { ToastAPI } from "../../context/ToastContext";
import { Calendar } from "primereact/calendar";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { Tooltip } from "primereact/tooltip";
import { useToastContext } from "../../context/ToastContext";
import { RegisterUser } from "../../services/UserService";

export const Register = () => {
  const toastRef = useToastContext();

  const navigate = useNavigate();
  const validate = (data) => {
    let errors = {};

    if (!data.email) {
      errors.email = "Email is required.";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
      errors.email = "Invalid email address. E.g. example@email.com";
    }

    if (data.password !== data.repassword) {
      errors.password = "Passwords are diffrent.";
      errors.repassword = "Passwords are diffrent.";
    }

    if (!data.password) {
      errors.password = "Password is required.";
    }
    if (!data.repassword) {
      errors.repassword = "Re-type Password is required.";
    }

    if (!data.accept) {
      errors.accept = "You need to agree to the terms and conditions.";
    }

    if (!data.birthDate) {
      errors.birthDate = "Birhday is required.";
    }

    if (
      data.birthDate > new Date().setFullYear(new Date().getFullYear() - 18)
    ) {
      errors.birthDate = "You are too young.";
    }

    return errors;
  };

  const onSubmit = async (data, form) => {
    RegisterUser(data)
      .then((res) => {
        console.log(res);
        ToastAPI(toastRef, res);
        form.restart();
        navigate("/Login");
      })
      .catch((err) => {
        ToastAPI(toastRef, err);
      });
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  const passwordHeader = <h6>Pick a password</h6>;
  const passwordFooter = (
    <>
      <Divider />
      <p className="mt-2">Suggestions</p>
      <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: "1.5" }}>
        <li>At least one lowercase</li>
        <li>At least one uppercase</li>
        <li>At least one numeric</li>
        <li>Minimum 8 characters</li>
      </ul>
    </>
  );

  return (
    <div
      className="Register"
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
      }}
    >
      <div style={{display:'flex', justifyContent: "center", margin:'auto'}}>
        <div className="Card" style={{padding:'2rem', backgroundColor:'white', borderRadius:"var(--border-radius)"}}>
          <div
            style={{
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
            Register
          </div>
          <Form
            onSubmit={onSubmit}
            initialValues={{
              email: "",
              password: "",
              repassword: "",
              birthDate: "",
              accept: false,
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
                          Email*
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
                          className={classNames({
                            "p-invalid": isFormFieldValid(meta),
                          })}
                          header={passwordHeader}
                          footer={passwordFooter}
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
                <Field
                  name="repassword"
                  render={({ input, meta }) => (
                    <div className="field">
                      <span className="p-float-label">
                        <Password
                          id="repassword"
                          {...input}
                          toggleMask
                          className={classNames({
                            "p-invalid": isFormFieldValid(meta),
                          })}
                          header={passwordHeader}
                          footer={passwordFooter}
                        />
                        <label
                          htmlFor="repassword"
                          className={classNames({
                            "p-error": isFormFieldValid(meta),
                          })}
                        >
                          Re-type Password
                        </label>
                      </span>
                      {getFormErrorMessage(meta)}
                    </div>
                  )}
                />
                <Field
                  name="birthDate"
                  render={({ input, meta }) => (
                    <div className="field">
                      <span className="p-float-label">
                        <Calendar
                          panelStyle={{ padding: "0px" }}
                          id="birthDate"
                          {...input}
                          dateFormat="dd/mm/yy"
                          mask="99/99/9999"
                          showIcon
                          className={classNames({
                            "p-invalid": isFormFieldValid(meta),
                          })}
                        />
                        <label htmlFor="date">Birthday</label>
                      </span>
                      {getFormErrorMessage(meta)}
                    </div>
                  )}
                />
                <Tooltip
                  target=".termsTip"
                  position="bottom"
                  style={{ maxWidth: "400px" }}
                >
                  <ol>
                    <li>
                      Using the application is only allowed for lawful purposes.
                    </li>
                    <li>
                      Creating an account is required to use the application.
                    </li>
                    <li>
                      The user is responsible for maintaining the
                      confidentiality of their account and password.
                    </li>
                    <li>
                      All content, features, and elements of the application are
                      owned by us or our licensors.
                    </li>
                    <li>
                      The user is responsible for the accuracy and completeness
                      of any information they provide in the application.
                    </li>
                    <li>
                      The user may not use the application to harass,
                      intimidate, or threaten others.
                    </li>
                  </ol>
                </Tooltip>
                <Field
                  name="accept"
                  type="checkbox"
                  render={({ input, meta }) => (
                    <div style={{ margin: "1rem 0" }} className="termsTip">
                      <Checkbox
                        inputId="accept"
                        {...input}
                        className={classNames({
                          "p-invalid": isFormFieldValid(meta),
                        })}
                      />{" "}
                      I agree to the terms and conditions*
                      <br />
                      {getFormErrorMessage(meta)}
                    </div>
                  )}
                />
                <Button type="submit" label="Submit" className="mt-2" />
              </form>
            )}
          />
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            Already have an account?{" "}
            <Link to="/Login" style={{ textDecoration: "none" }}>
              Log in here!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
