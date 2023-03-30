import { useAPI } from "hooks/useAPI";

export function GetFiles(listId) {
  var params = {
    listId: listId,
  };

  var config = {
    method: "get",
    url: process.env.REACT_APP_BASE_URL + "File/GetFiles",
    params,
  };

  return useAPI(config);
}

export function DownloadFile(fileId) {
  var params = {
    fileId: fileId,
  };

  var config = {
    method: "get",
    url: process.env.REACT_APP_BASE_URL + "File/DownloadFile",
    params,
  };

  return useAPI(config);
}

export function CreateFile(props) {
  var params = {
    listId: props.body.listId,
  };
  let size = 0;
  const formData = new FormData();
  props.body.files.forEach((file) => {
    formData.append("formData", file);
    size += file.size;
  });

  var config = {
    method: "post",
    url: process.env.REACT_APP_BASE_URL + "File/CreateFile",
    params: params,
    data: formData,
    onUploadProgress: (progressEvent) => {
      props.setUploadedPecent(Math.round((progressEvent.loaded * 100) / size));
    },
  };

  return useAPI(config);
}

export function DeleteFile({ fileId }) {
  var params = {
    fileId: fileId,
  };

  var config = {
    method: "delete",
    url: process.env.REACT_APP_BASE_URL + "File/DeleteFile",
    params: params,
  };

  return useAPI(config);
}
