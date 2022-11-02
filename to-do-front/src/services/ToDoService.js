import { useAPI, useFilesAPI } from "../hooks/useAPI";

export function GetLists() {
  var config = {
    method: "get",
    url: process.env.REACT_APP_BASE_URL + "ItemList/GetLists",
  };
  return useAPI(config);
}

export function UpdateList({ list }) {
  var data = {
    id: list.id,
    name: list.name,
    email: list.email,
    finished: list.finished,
  };
  var config = {
    method: "put",
    url: process.env.REACT_APP_BASE_URL + "ItemList/UpdateList",
    data: data,
  };
  return useAPI(config);
}

export function AddList({ listName, finishDate }) {
  var data = {
    Name: listName,
    FinishDate: finishDate,
  };
  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "ItemList/AddList",
    data: data,
  };

  return useAPI(config);
}

export function EditList(list) {
  var data = {
    id: list.id,
    name: list.name,
    email: list.email,
    finished: list.finished,
    items: list.items,
    finishDate: list.finishDate,
    createdDate: list.createdDate,
  };

  var config = {
    method: "put",
    url: process.env.REACT_APP_BASE_URL + "ItemList/UpdateList",
    data: data,
  };

  return useAPI(config);
}
export function DeleteList(list) {
  var params = {
    listId: list.id,
  };

  var config = {
    method: "delete",
    url: process.env.REACT_APP_BASE_URL + "ItemList/DeleteList",
    params,
  };
  return useAPI(config);
}

export function AddItem({ listId, itemName }) {
  var params = {
    listId: listId,
    itemName: itemName,
  };
  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "ItemList/AddItem",
    params: params,
  };
  return useAPI(config);
}

export function DeleteItem({ listId, itemId }) {
  var params = {
    listId: listId,
    itemId: itemId,
  };
  var config = {
    method: "delete",
    url: process.env.REACT_APP_BASE_URL + "ItemList/DeleteItem",
    params: params,
  };

  return useAPI(config);
}
export function UpdateItem({ listId, item }) {
  var params = {
    listId: listId,
  };
  var config = {
    method: "put",
    url: process.env.REACT_APP_BASE_URL + "ItemList/UpdateItem",
    params: params,
    data: item,
  };

  return useAPI(config);
}

export function AddFile({ listId, files }) {
  var params = {
    listId: listId,
  };

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "ItemList/AddFile",
    params: params,
    data: formData,
  };

  return useAPI(config);
}

export function GetFile({ fileId }) {
  var params = {
    fileId: fileId,
  };

  var config = {
    method: "get",
    url: process.env.REACT_APP_BASE_URL + "ItemList/GetFile",
    params: params,
  };

  return useAPI(config);
}
export function DeleteFile({ listId, fileId }) {
  var params = {
    fileId: fileId,
    listId: listId,
  };

  var config = {
    method: "delete",
    url: process.env.REACT_APP_BASE_URL + "ItemList/DeleteFile",
    params: params,
  };

  return useAPI(config);
}
