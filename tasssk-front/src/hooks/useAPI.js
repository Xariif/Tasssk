import axios from "axios";

function token() {
  return window.localStorage.getItem("token");
}

export function useAPI(config) {
  config = {
    ...config,
    headers: {
      Authorization: "Bearer " + token(),
    },
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error.response);
      });
  });
}
