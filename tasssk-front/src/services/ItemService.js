import { useAPI } from "../hooks/useAPI";

var url = process.env.REACT_APP_API_URL + "Item/";

export function GetItems(props) {
  var params = {
    listId: props,
  };
  var config = {
    method: "get",
    url: url + "GetItems",
    params: params,
  };
  return useAPI(config);
}

export function CreateItem(item) {
  var config = {
    method: "post",
    url: url + "CreateItem",
    data: item,
  };

  return useAPI(config);
}

export function UpdateItem(item) {
  var config = {
    method: "put",
    url: url + "UpdateItem",
    data: item,
  };
  return useAPI(config);
}

export function DeleteItem(item) {
  var config = {
    method: "delete",
    url: url + "DeleteItem",
    data: item,
  };

  return useAPI(config);
}
