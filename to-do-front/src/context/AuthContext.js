import React, { useContext, useState } from "react";

import useLocalStorage from "../hooks/useLocalStorage";

const AuthContext = React.createContext();
const AuthUpdateContext = React.createContext();

export function useAuthContext() {
  return useContext(AuthContext);
}
export function useAuthUpdateContext() {
  return useContext(AuthUpdateContext);
}
export function AuthContextProvider({ children }) {
  const [localStorage, setLocalStorage] = useLocalStorage("token");
  function validateToken() {
    const token = localStorage;

    if (token) {
      //need add backennd validation
      return true;
    }
    return false;
  }

  const [auth, setAuth] = useState(validateToken);

  function changeAuth(value) {
    setAuth(value);
  }

  return (
    <>
      <AuthContext.Provider value={auth}>
        <AuthUpdateContext.Provider value={changeAuth}>
          {children}
        </AuthUpdateContext.Provider>
      </AuthContext.Provider>
    </>
  );
}
