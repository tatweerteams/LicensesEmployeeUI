import axios from "axios";
import store from "../store";
import { getToken } from "./session";
import router from "../router/index.js";
// create an axios instance
const service = axios.create({
  baseURL: "https://localhost:7208",
  //  baseURL: "https://marathon.tatweer.ly:44318",
  timeout: 90000, // request timeout
});
// var test=  getXAntiForgeryWithKey();
// service.defaults.headers['X-XSRF-TOKEN'] = test;

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
  
    // config.headers["X-XSRF-TOKEN"] = test;
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
        router.replace("/401").catch(() => {});
        return Promise.reject(res.messages[0]);
      }
      if (res.stateResult == 5) {
        return Promise.reject(res.messages[0]);
      }

      if (res.stateResult == 6) {
        return Promise.reject(res);
      }

      if (res.stateResult == 7) {
        router.replace("/WorkTime").catch(() => {});
        return res;
        // return Promise.reject(res.messages[0]);
      }

      if (res.stateResult == 0) {
        return res;
      }
    }
  },
  (error) => {
    console.log("err" + error); // for debug
    return Promise.reject("يرجى مراجعة المسؤول على النظام");
  }
);

export default service;
