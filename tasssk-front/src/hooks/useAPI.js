import axios from "axios";

function token() {
  return window.localStorage.getItem("token");
}

export function useAPI(config) {
  config = {
    ...config,
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token(),
    },
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

export function useFileAPI(config) {
  config = {
    ...config,
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: "Bearer " + token(),
    },
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}
