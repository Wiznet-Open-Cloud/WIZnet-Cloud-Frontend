import React from "react";
import axios from "axios";
import qs from "qs";

const proxyUrl = "https://cors-anywhere.herokuapp.com/";
const requestUrl = "https://wiznetcloud.auth0.com/oauth/token";
const requestBody = {
  grant_type: "client_credentials",
  client_id: "RaA9AVx5b4lR6G08aog724z3e5DbSfi7",
  client_secret:
    "jDSkIQRxpcvHdW4h3wryBLemrjVoL-7Xh9XftHdAzM5bezoLo_8C3BYSsorBghOk",
  audience: "https://us-central1-wiznetiotservice.cloudfunctions.net/api/wiznet"
};

const axiosConfig = {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
  },
  url: proxyUrl + requestUrl, // CORS proxy issue
  // url: requestUrl,
  maxContentLength: 2000,
  data: qs.stringify(requestBody)
};

const UpdateAuth = () => {
  React.useEffect(() => {
    axios(axiosConfig)
      .then(response => {
        // console.log("Response >", response);
        if (response.data) {
          let accessToken = response.data;
          localStorage.setItem("access_token", accessToken["access_token"]);
          // console.log("<UpdateAuth>", accessToken["access_token"]);
        }
      })
      .catch(error => {
        // if (error.response) {
        //   console.log("error.response >>", error.response);
        // } else if (error.request) {
        //   console.log("error.request >>", error.request);
        // } else {
        //   console.log("axios post error >>", error.message);
        // }
        console.log("error.config >>", error.config);
      });
  });

  return null;
};

export default UpdateAuth;
