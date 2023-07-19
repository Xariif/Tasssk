import React from "react";

import { useLocation, Link } from "react-router-dom";
import { useAuthUpdateContext } from "../../../context/AuthContext";

import logo from "./../../../logo.png";
import { useContext } from "react";
import { Badge } from "primereact/badge";

import "./TopBar.scss";
import { NotificationContext } from "./../../../context/NotificationContext";
import PrimeReact from "primereact/api";

function TopBar() {
  const { visible, notifications, badge } = useContext(NotificationContext);
  const [notificationsVisible, setNotificationsVisible] = visible;
  const [badgeCount, setBadgeCount] = badge;

  const setAuth = useAuthUpdateContext();
  const location = useLocation();

  const logOut = () => {
    localStorage.clear();
  };

  const imgSize = 2;

  return (
    <div className="TopBar">
      <Link to="/" style={{ backgroundColor: "#f3c21e" }}>
        <img src={logo} height="30px" />
      </Link>

      <ul className="navbar">
        <li>
          <Link
            to="/Events"
            className={location.pathname === "/Events" ? "active-link" : "link"}
          >
            <i className="pi pi-fw pi-calendar" />
            {location.pathname === "/Events" && "Events"}
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
            {location.pathname === "/ToDoList" && "To Do List"}
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
            {location.pathname === "/Settings" && "Settings"}
          </Link>
        </li>
        <li>
          <Link
            onClick={() => {
              setNotificationsVisible(true);
            }}
          >
            <i className="pi pi-bell p-overlay-badge">
              {badgeCount ? <Badge value={badgeCount}></Badge> : <></>}
            </i>
          </Link>
        </li>
        <li>
          <Link
            to="/Login"
            onClick={() => {
              logOut();
              PrimeReact.changeTheme(
                "lara-dark-blue",
                "lara-light-blue",
                "theme-link",
                () => {}
              );
            }}
          >
            <i className="pi pi-fw pi-power-off" />
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default TopBar;
