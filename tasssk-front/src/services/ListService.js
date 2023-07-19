import { useAPI } from "../hooks/useAPI";

var url = process.env.REACT_APP_API_URL + "List/";

export function GetLists(listId) {
  var config = {
    method: "get",
    url: url + "GetLists",
    params: {
      selectedListId: listId,
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
    url: url + "CreateList",
    data: data,
  };

  return useAPI(config);
}

export function UpdateList(props) {
  var config = {
    method: "put",
    url: url + "UpdateList",
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
    url: url + "DeleteList",
    params,
  };
  return useAPI(config);
}

export function SendInvite({ email, selectedList }) {
  const data = {
    Receiver: email,
    ListId: selectedList.id,
  };
  var config = {
    method: "post",
    url: url + "SendInvite",
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
  var config = {
    method: "post",
    url: url + "AcceptInvite",
    data: data,
  };
  return useAPI(config);
}

export function ListPrivileges(listId) {
  var config = {
    method: "get",
    url: url + "ListPrivileges",
    params: {
      listId: listId,
    },
  };
  return useAPI(config);
}

export function RemoveAccess(listId, user) {
  var config = {
    method: "delete",
    url: url + "RemoveAccess",
    params: {
      listId: listId,
      user: user,
    },
  };
  return useAPI(config);
}
