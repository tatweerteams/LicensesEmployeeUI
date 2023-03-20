import {
  getPermisstions,
  getActivePermisstions,
  activationPermisstion,
  insertPermisstion,
  updatePermisstion,
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
    activePermisstions: [],
    pageCount: 0,
  },

  getters: {
    getDataFields,
    GET_ACTIVE_PERMISSTIONS(state) {
      return state.activePermisstions;
    },
  },

  mutations: {
    updateDataField,

    SET_DATA_PERMISSTIONS(state, permisstions) {
      state.grids = permisstions;
    },
    SET_ACTIVE_PERMISSTIONS(state, permisstions) {
      state.activePermisstions = permisstions;
    },
    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },
  },

  actions: {
    GetPermisstions({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getPermisstions(filter)
          .then((response) => {
            commit("SET_DATA_PERMISSTIONS", response.result.data);
            commit("SET_PAGE_COUNT", response.result.pageCount);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    GetActivePermisstions({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getActivePermisstions(filter)
          .then((response) => {
            commit("SET_ACTIVE_PERMISSTIONS", response.result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    InsertPermisstion({ commit }, item) {
      return new Promise((resolve, reject) => {
        insertPermisstion(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    UpdatePermisstion({ commit }, item) {
      return new Promise((resolve, reject) => {
        updatePermisstion(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ActivationPermisstion({ commit }, item) {
      return new Promise((resolve, reject) => {
        activationPermisstion(item)
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
