import React from "react";

import "./Footer.scss";

function Footer() {
  return (
    <div className="Footer">
      <p>
        <b style={{ opacity: "0.7" }}>
          {new Date().getFullYear()} © Stork Corp
        </b>
      </p>
      <p>
        <b>
          {" "}
          Tasssk v0.2 by Jakub Filiks
          <br />
          <a href="mailto: jakubfiliks7@gmail.com ">Contact</a>
        </b>
      </p>
    </div>
  );
}

export default Footer;
