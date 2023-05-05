import React, { useContext, useState } from "react";

import useLocalStorage from "../hooks/useLocalStorage";
import { ValidateToken } from "services/UserService";
import { useNavigate } from "react-router-dom";

const AuthContext = React.createContext(false);
const AuthUpdateContext = React.createContext(() => {});

export function useAuthContext() {
  return useContext(AuthContext);
}
export function useAuthUpdateContext() {
  return useContext(AuthUpdateContext);
}
export function AuthContextProvider({ children }) {
  const [tokenStorage, setTokenStorage] = useLocalStorage("token");
  const navigate = useNavigate();

  function isCorrect() {
    const token = tokenStorage;
    if (token) {
      var isValid = ValidateToken(token)
        .then((res) => {
          console.log(res);
          if (res.data === false) {
            localStorage.clear();
            navigate("/Login");
          }
          return res.data;
        })
        .catch((err) => {
          localStorage.clear();
          navigate("/Login");
        });
      console.log(isValid);
      return isValid;
    }
  }

  const [auth, setAuth] = useState(isCorrect);

  function changeAuth(value) {
    setAuth(value);
  }

  return (
    <AuthContext.Provider value={auth}>
      <AuthUpdateContext.Provider value={changeAuth}>
        {children}
      </AuthUpdateContext.Provider>
    </AuthContext.Provider>
  );
}
