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

      <p>
        <b>
          Tasssk v0.9 by Jakub Filiks
          <br />
        </b>
      </p>
    </div>
  );
}

export default Footer;
