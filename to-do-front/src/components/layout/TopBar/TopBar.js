import { hover } from "@testing-library/user-event/dist/hover";
import React from "react";
import { useLocation, Link } from "react-router-dom";

import { useAuthUpdateContext } from "../../../context/AuthContext";
import { useThemeContext } from "../../../context/ThemeContext";
import { useThemeUpdateContext } from "../../../context/ThemeContext";

import "./TopBar.scss";

function TopBar() {
  const setAuth = useAuthUpdateContext();
  const location = useLocation();
  //const setTheme = useThemeUpdateContext();

  const logOut = () => {
    localStorage.clear();

    //    setTheme(false);
    setAuth(false);
  };

  const imgSize = 2;

  return (
    <div className="TopBar">
      <ul>
        <li>
          <Link to="/" id="home">
            <i
              className="pi pi-fw pi-th-large"
              style={{ fontSize: "2rem", fontWeight: "bold" }}
            />
          </Link>
        </li>
      </ul>

      <ul>
        <li>
          <Link
            to="/Events"
            className={location.pathname === "/Events" ? "active-link" : "link"}
          >
            <i className="pi pi-fw pi-calendar" />
            Events
          </Link>
        </li>

        <li>
          <Link
            to="/ToDoList"
            className={
              location.pathname === "/ToDoList" ? "active-link" : "link"
            }
          >
            <i className="pi pi-fw pi-list" />
            To Do List
          </Link>
        </li>
        <li>
          <Link
            to="/Settings"
            className={
              location.pathname === "/Settings" ? "active-link" : "link"
            }
          >
            <i className="pi pi-fw pi-cog" />
            Settings
          </Link>
        </li>
        <li>
          <Link to="/Login" className="link" onClick={() => logOut()}>
            <i className="pi pi-fw pi-power-off" />
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default TopBar;
