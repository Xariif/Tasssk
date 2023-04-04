import React, { useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { ChangeTheme } from "../services/UserService";

const ThemeContext = React.createContext(false);
const ThemeUpdateContext = React.createContext(() => {});

export function useThemeContext() {
  return useContext(ThemeContext);
}
export function useThemeUpdateContext() {
  return useContext(ThemeUpdateContext);
}
export function ThemeContextProvider({ children }) {
  const [localStorage, setLocalStorage] = useLocalStorage("darkMode");

  const [theme, setTheme] = useState(Boolean(localStorage));

  const changeTheme = (newTheme) => {
    if (newTheme) setLocalStorage(newTheme);
    else setLocalStorage("");
    setTheme(newTheme);
  };
  return (
    <>
      <ThemeContext.Provider value={theme}>
        <ThemeUpdateContext.Provider value={changeTheme}>
          {children}
        </ThemeUpdateContext.Provider>
      </ThemeContext.Provider>
    </>
  );
}
