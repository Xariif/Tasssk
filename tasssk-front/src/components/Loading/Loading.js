import { Divider } from "primereact/divider";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect, useState } from "react";

export default function Loading() {
  const [loadDots, setLoadDots] = useState("Loading");
  useEffect(() => {
    var interval = setInterval(() => {
      setLoadDots(loadDots + ".");
      if (loadDots.length === 10) setLoadDots("Loading");
    }, 500);
    return () => clearInterval(interval);
  }, [loadDots]);
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100%",
        alignItems: "center",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <ProgressSpinner style={{ height: "15rem", width: "15rem" }} />
        <Divider />
        <h1>{loadDots}</h1>
      </div>
    </div>
  );
}
