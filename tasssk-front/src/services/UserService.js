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
    method: "post",
    url: url + "ChangeTheme",
  };
  return useAPI(config);
}

export async function ChangePassword(props) {
  console.log(props);
  var data = {
    OldPassword: props.OldPassword,
    NewPassword: props.NewPassword,
  };
  var config = {
    method: "put",
    url: url + "ChangePassword",
    data,
  };
  return useAPI(config);
}
