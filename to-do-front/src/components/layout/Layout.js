import React from "react";

import TopBar from "./TopBar/TopBar";
import Footer from "./Footer/Footer";
import { Card } from "primereact/card";

import "./Layout.scss";

function Layout(props) {
  return (
    <>
      <TopBar />
      <div className="Main">
        <div className="Content">{props.content}</div>
      </div>
      <Footer />
    </>
  );
}

export default Layout;
