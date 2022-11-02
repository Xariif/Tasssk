import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

import { Calendar } from "primereact/calendar";
import { Password } from "primereact/password";
import { Checkbox } from "primereact/checkbox";
import { Divider } from "primereact/divider";
import { classNames } from "primereact/utils";
import { Tooltip } from "primereact/tooltip";
import { useToastContext } from "../../../context/ToastContext";
import { RegisterUser } from "../../../services/UserService";

import "./Register.scss";

export const Register = () => {
  const [formData, setFormData] = useState({});
  const toast = useToastContext();
  const sub = false;
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
      errors.birthDate = "You are to young.";
    }

    return errors;
  };

  const onSubmit = async (data, form) => {
    try {
      await RegisterUser(data).then((res) => {
        toast.current.show({
          severity: "success",
          summary: "Success ",
          detail: res,
          life: 5000,
        });
        form.restart();
        navigate("/Login");
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: error.code,
        life: 5000,
      });
    }
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
    <div className="Register">
      <div className="flex justify-content-center">
        <div
          className="Card"
          style={{
            border: "1px solid var(--text-color) ",
            borderRadius: "20px",
          }}
        >
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
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Phasellus eget est tellus. Mauris cursus leo quis mi congue
                  faucibus. Donec aliquam condimentum elementum. Quisque porta
                  lacus a mi rutrum consectetur. Aliquam pretium tincidunt
                  dolor, efficitur placerat purus lacinia lacinia. Donec
                  fringilla posuere luctus. Interdum et malesuada fames ac ante
                  ipsum primis in faucibus. Phasellus nulla sapien, commodo sit
                  amet volutpat at, viverra a sapien. Aliquam vitae consectetur
                  nunc. Fusce fermentum quam a tincidunt sodales. Lorem ipsum
                  dolor sit amet, consectetur adipiscing elit. Praesent ac dolor
                  sagittis dui sodales faucibus. Lorem ipsum dolor sit amet,
                  consectetur adipiscing elit. Nam ex mi, iaculis sed libero
                  nec, scelerisque tincidunt dolor.
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
          <div style={{ marginTop: "1rem" }}>
            Already have an account?
            <br />
            Log in{" "}
            <Link to="/Login" style={{ textDecoration: "none" }}>
              here!
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
