import React, { useEffect } from "react";
import "./NotFound.scss";
import { Navigate, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  setTimeout(() => {
    navigate("/");
  }, 3000);

  return (
    <div className="NotFound">
      <p>
        PAGE NOT FOUND! <br />
        ERROR: 404
      </p>
    </div>
  );
}
