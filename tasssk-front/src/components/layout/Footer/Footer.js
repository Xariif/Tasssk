import React from "react";

import "./Footer.scss";

function Footer() {
  return (
    <div className="Footer">
      <p>
        <b style={{ opacity: "0.7" }}>
          {new Date().getFullYear()} © Stork Corp
        </b>
      </p>{" "}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <a href="https://github.com/Xariif">
          <i className="pi pi-github" />
        </a>

        <a href="https://www.linkedin.com/in/jakub-filiks-4537b9225/">
          <i className="pi pi-linkedin" />
        </a>
        <a href="mailto: jakubfiliks7@gmail.com ">
          <i className="pi pi-at" />
        </a>
      </div>
      <p>
        <b>
          Tasssk v0.2 by Jakub Filiks
          <br />
        </b>
      </p>
    </div>
  );
}

export default Footer;
