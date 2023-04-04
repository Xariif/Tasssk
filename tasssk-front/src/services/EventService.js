import { useAPI } from "../hooks/useAPI";

var url = process.env.REACT_APP_BASE_URL + "Event/";

export function GetEvents() {
  var config = {
    method: "get",
    url: url + "GetEvents",
  };
  return useAPI(config);
}
