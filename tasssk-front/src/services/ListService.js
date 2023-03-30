import { useAPI, useFileAPI } from "../hooks/useAPI";

export function GetLists() {
  var config = {
    method: "get",
    url: process.env.REACT_APP_BASE_URL + "List/GetLists",
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
    url: process.env.REACT_APP_BASE_URL + "List/CreateList",
    data: data,
  };

  return useAPI(config);
}

export function UpdateList(props) {
  var config = {
    method: "put",
    url: process.env.REACT_APP_BASE_URL + "List/UpdateList",
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
    url: process.env.REACT_APP_BASE_URL + "List/DeleteList",
    params,
  };
  return useAPI(config);
}
//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

export function SendInviteToList({ email, list }) {
  console.log(list, email);
  const x = {
    Sender: "",
    Receiver: email,
    Privileges: {
      ListObjectId: list.id,
      ListPermission: {
        Owner: false,
        Read: false,
        Write: false,
        Modify: false,
        Delete: false,
      },
    },
  };
  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "ItemList/SendInviteToList",
    data: x,
  };

  return useAPI(config);
}

export function AcceptInvite(props) {
  var data = {
    Sender: props.sender,
    Receiver: props.receiver,
    Privileges: {
      ListObjectId: props.privileges.listObjectId,
      ListPermission: {
        Owner: props.privileges.listPermission.owner,
        Read: props.privileges.listPermission.read,
        Write: props.privileges.listPermission.write,
        Modify: props.privileges.listPermission.modify,
        Delete: props.privileges.listPermission.delete,
      },
    },
  };

  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "ItemList/AcceptInvite",
    data: data,
  };
  return useAPI(config);
}

export function GetUserPrivilages(listId) {
  var params = {
    listId: listId,
  };

  var config = {
    method: "get",
    url: process.env.REACT_APP_BASE_URL + "ItemList/GetUserPrivilages",
    params,
  };
  return useAPI(config);
}

export function GetUsersListPrivilages(listId) {
  var params = {
    listId: listId,
  };

  var config = {
    method: "get",
    url: process.env.REACT_APP_BASE_URL + "ItemList/GetUsersListPrivilages",
    params,
  };
  return useAPI(config);
}
