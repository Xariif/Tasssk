import { useAPI } from "../hooks/useAPI";

export function GetEvents() {
  var config = {
    method: "get",
    url: process.env.REACT_APP_BASE_URL + "Event/GetEvents",
  };
  return useAPI(config);
}
