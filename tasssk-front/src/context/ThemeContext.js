import React, { useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { ChangeTheme } from "../services/UserService";

const ThemeContext = React.createContext(
  "https://unpkg.com/primereact/resources/themes/lara-light-indigo/theme"
);
const ThemeUpdateContext = React.createContext();

export function useThemeContext() {
  return useContext(ThemeContext);
}
export function useThemeUpdateContext() {
  return useContext(ThemeUpdateContext);
}
export function ThemeContextProvider({ children }) {
  const [localStorage, setLocalStorage] = useLocalStorage("darkMode");
  const [theme, setTheme] = useState(localStorage);

  const changeBoostrapTheme = (theme) => {
    console.log("change,", theme);

    let themeLink = document.getElementById("app-theme");
    if (themeLink) {
      themeLink.href = theme + ".css";
    }
  };

  function changeTheme(value) {
    console.log(value);
    setLocalStorage(value);
    ChangeTheme();

    if (value) {
      changeBoostrapTheme(
        "https://unpkg.com/primereact/resources/themes/viva-dark/theme"
      );
    } else {
      changeBoostrapTheme(
        "https://unpkg.com/primereact/resources/themes/viva-light/theme"
      );
    }

    setTheme(value);
  }

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
