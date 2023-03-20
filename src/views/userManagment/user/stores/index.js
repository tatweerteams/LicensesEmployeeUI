import {
  getUsers,
  activationUser,
  insertUser,
  updateUser,
  resetPassword
} from "../apis/index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  namespaced: true,
  state: {
    grids: [],
    pageCount: 0,
  },

  getters: {
    getDataFields,
  },

  mutations: {
    updateDataField,

    SET_DATA_USERS(state, users) {
      state.grids = users;
    },

    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },
  },

  actions: {
    GetUsers({ commit }, filter) {
      console.log(filter)
      return new Promise((resolve, reject) => {
        getUsers(filter)
          .then((response) => {
            commit("SET_DATA_USERS", response.result.data);
            commit("SET_PAGE_COUNT", response.result.pageCount);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    InsertUser({ commit }, item) {
      return new Promise((resolve, reject) => {
        insertUser(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    UpdateUser({ commit }, item) {
      return new Promise((resolve, reject) => {
        updateUser(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ActivationUser({ commit }, item) {
        
      return new Promise((resolve, reject) => {
        activationUser(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    ResetPassword({ commit }, item) {
      return new Promise((resolve, reject) => {
        resetPassword(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
