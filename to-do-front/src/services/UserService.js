import { useAPI } from "../hooks/useAPI";

export async function LoginUser(loginData) {
  var data = {
    Email: loginData.email,
    Password: loginData.password,
  };
  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "User/Login",
    data: data,
  };
  return useAPI(config);
}

export async function RegisterUser(registerData) {
  const data = {
    Email: registerData.email,
    Password: registerData.password,
    BirthDate: registerData.birthDate,
  };
  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "User/Register",
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
    url: process.env.REACT_APP_BASE_URL + "User/DeleteAccount",
    params,
  };
  return useAPI(config);
}

export async function ChangeTheme() {
  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "User/ChangeTheme",
  };
  return useAPI(config);
}
