import { useAPI } from "../hooks/useAPI";

var url = process.env.REACT_APP_API_URL + "Notification/";

export async function GetNotifications() {
  var config = {
    method: "get",
    url: url + "GetNotifications",
  };
  return useAPI(config);
}

export async function GetInviteNotification(id) {
  const params = {
    id: id,
  };
  var config = {
    method: "get",
    url: url + "GetInviteNotification",
    params,
  };
  return useAPI(config);
}
export async function CreateNotification(props) {
  var data = {
    Email: props.Email,
    Header: props.Header,
    Body: props.Body,
  };
  var config = {
    method: "post",
    url: url + "CreateNotification",
    data,
  };
  return useAPI(config);
}

export async function DeleteNotification(notificationId) {
  const params = {
    notificationId: notificationId,
  };
  var config = {
    method: "delete",
    url: url + "DeleteNotification",
    params,
  };
  return useAPI(config);
}

export async function SetNotificationReaded(notificationId) {
  const params = {
    notificationId: notificationId,
  };
  var config = {
    method: "put",
    url: url + "SetNotificationReaded",
    params,
  };
  return useAPI(config);
}
