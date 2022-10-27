import { useEffect, React } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Routes, Route } from "react-router-dom";

import Home from "./components/pages/Home/Home";
import Events from "./components/pages/Events/Events";
import Login from "./components/auth/Login/Login";
import NotFound from "./components/pages/NotFound/NotFound";
import Settings from "./components/pages/Settings/Settings";
import Register from "./components/auth/Register/Register";
import ToDoList from "./components/pages/ToDoList/ToDoList";
import Layout from "./components/layout/Layout";
import { Toast } from "primereact/toast";

import { useAuthContext, useAuthUpdateContext } from "./context/AuthContext";
import { useToastContext } from "./context/ToastContext";
import { useThemeContext } from "./context/ThemeContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import useLocalStorage from "./hooks/useLocalStorage";

import "./App.css";

function App() {
  const auth = useAuthContext();
  const theme = useThemeContext();

  const toastRef = useToastContext();

  const [token, setToken] = useLocalStorage("token");

  useEffect(() => {
    if (auth == false) {
      if (token) {
        //const decodedToken = jwt_decode(token);
        //console.log(decodedToken);
        //check if tooken is in local storage
        //validate token api request
      }
    }
  }, [token]);

  return (
    <>
      <Toast ref={toastRef} position={"bottom-center"} />
      <Routes>
        <Route
          path="/"
          element={
            auth ? <Layout content={<Outlet />} /> : <Navigate to="/Login" />
          }
        >
          <Route path="/" element={<Home />} />

          <Route path="/Events" element={<Events />} />

          <Route path="/Settings" element={<Settings />} />

          <Route path="/ToDoList" element={<ToDoList />} />
        </Route>

        <Route path="/Login" element={<Login />} />

        <Route path="/Register" element={<Register />} />

        <Route path="*" exact={true} element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
