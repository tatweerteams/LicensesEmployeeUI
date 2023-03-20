import axios from "axios";
//import { MessageBox, Message } from "element-ui";
import store from "../store";
import { getToken } from "./session";

// create an axios instance
const service = axios.create({

  baseURL: "https://localhost:5010/api",
  // baseURL: "https://kyc.tatweer.ly:44310/api",


});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (store.getters["auth/getToken"]) {
      config.headers["Authorization"] = "Bearer " + getToken();
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data;

    // if the custom code is not 20000, it is judged as an error.
    if (response.status !== 200) {
      // Message({
      //   message: res.message || "Error",
      //   type: "error",
      //   duration: 5 * 1000
      // });

      // alert(res.messages || "Error");

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;

      return Promise.reject(new Error(res.message || "Error"));
    } else {
      if (res.stateResult == 1) {
        return Promise.reject(res.messages[0]);
      }

      if (res.stateResult == 2) {
        return Promise.reject(res.messages[0]);
      }

      if (res.state == 3) {
        return Promise.reject(res.messages[0].error);
      }
      if (res.stateResult == 4) {
        return Promise.reject(res.messages[0]);
      }
      if (res.stateResult == 5) {
        return Promise.reject(res.messages[0]);
      }

      if (res.stateResult == 6) {
        return Promise.reject(res);
      }

      if (res.stateResult == 7) {
        return Promise.reject(res.messages[0]);
      }

      if (res.stateResult == 0) {
        return res;
      }
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    return Promise.reject("يرجى مراجعة المسؤول علي النظام");
  }
);

export default service;
