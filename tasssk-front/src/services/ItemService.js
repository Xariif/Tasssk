import { useAPI } from "../hooks/useAPI";

export function GetItems(props) {
  var params = {
    listId: props,
  };
  var config = {
    method: "get",
    url: process.env.REACT_APP_BASE_URL + "Item/GetItems",
    params: params,
  };
  return useAPI(config);
}

export function CreateItem(item) {
  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "Item/CreateItem",
    data: item,
  };

  return useAPI(config);
}

export function UpdateItem(item) {
  var config = {
    method: "put",
    url: process.env.REACT_APP_BASE_URL + "Item/UpdateItem",
    data: item,
  };
  return useAPI(config);
}

export function DeleteItem(item) {
  var config = {
    method: "delete",
    url: process.env.REACT_APP_BASE_URL + "Item/DeleteItem",
    data: item,
  };

  return useAPI(config);
}
