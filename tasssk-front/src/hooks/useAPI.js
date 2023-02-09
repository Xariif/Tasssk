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
    onUploadProgress: (progressEvent) => console.log(progressEvent.loaded),
  };

  return new Promise((resolve, reject) => {
    axios(config)
      .then(function(response) {
        console.log(response.data);
        resolve(response.data);
      })
      .catch(function(error) {
        reject(error);
      });
  });
}
