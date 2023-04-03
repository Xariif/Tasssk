import { useAPI, useFileAPI } from "../hooks/useAPI";

var url = process.env.REACT_APP_BASE_URL + "List/";

export function GetLists(selectedItem) {
  var config = {
    method: "get",
    url: process.env.REACT_APP_BASE_URL + "GetLists",
    params: {
      selectedItemId: selectedItem,
    },
  };
  return useAPI(config);
}

export function CreateList({ listName, finishDate }) {
  var data = {
    Name: listName,
    FinishDate: finishDate,
  };
  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "CreateList",
    data: data,
  };

  return useAPI(config);
}

export function UpdateList(props) {
  var config = {
    method: "put",
    url: process.env.REACT_APP_BASE_URL + "UpdateList",
    data: props,
  };
  return useAPI(config);
}

export function DeleteList(props) {
  var params = {
    id: props.id,
  };
  var config = {
    method: "delete",
    url: process.env.REACT_APP_BASE_URL + "DeleteList",
    params,
  };
  return useAPI(config);
}

//PRIVILEGES AND INVITE REQUESTS

export function SendInvite({ email, selectedData }) {
  const data = {
    Receiver: email,
    ListId: selectedData.list.id,
  };
  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "SendInvite",
    data: data,
  };

  return useAPI(config);
}

export function AcceptInvite(props) {
  var data = {
    ListId: props.listId,
    Privileges: {
      Email: props.privileges.email,
      Owner: false,
      Read: props.privileges.read,
      Write: props.privileges.write,
      Modify: props.privileges.modify,
      Delete: props.privileges.delete,
    },
  };
  console.log(data);
  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "AcceptInvite",
    data: data,
  };
  return useAPI(config);
}
