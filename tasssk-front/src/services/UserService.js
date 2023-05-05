import { useAPI } from "../hooks/useAPI";

var url = process.env.REACT_APP_BASE_URL + "User/";

export async function LoginUser(props) {
  var data = {
    Email: props.email,
    Password: props.password,
  };
  var config = {
    method: "post",
    url: url + "Login",
    data: data,
  };
  return useAPI(config);
}

export async function RegisterUser(props) {
  const data = {
    Email: props.email,
    Password: props.password,
    BirthDate: props.birthDate,
  };
  var config = {
    method: "post",
    url: url + "Register",
    data: data,
  };
  return useAPI(config);
}

export async function DeleteAccount(password) {
  const params = {
    password: password,
  };
  var config = {
    method: "delete",
    url: url + "DeleteAccount",
    params,
  };
  return useAPI(config);
}

export async function ChangeTheme() {
  var config = {
    method: "put",
    url: url + "ChangeTheme",
  };
  return useAPI(config);
}

export async function ChangePassword(props) {
  var data = {
    OldPassword: props.passOld,
    NewPassword: props.passNew,
  };
  var config = {
    method: "put",
    url: url + "ChangePassword",
    data,
  };
  return useAPI(config);
}

export async function ValidateToken(token) {
  const params = {
    token: token,
  };
  var config = {
    method: "post",
    url: url + "ValidateToken",
    params,
  };
  return useAPI(config);
}
