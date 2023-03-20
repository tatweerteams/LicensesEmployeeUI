import {
  getRoles,
  getActiveRoles,
  activationRole,
  insertRole,
  updateRole,
  deleteRole,
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
    activeRoles: [],
    pageCount: 0,
  },

  getters: {
    getDataFields,

    GET_ACTIVE_ROLES(state) {
      return state.activeRoles;
    },
  },

  mutations: {
    updateDataField,

    SET_DATA_ROLES(state, roles) {
      state.grids = roles;
    },
    SET_ACTIVE_ROLES(state, roles) {
      state.activeRoles = roles;
    },
    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },
  },

  actions: {
    GetRoles({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getRoles(filter)
          .then((response) => {
            commit("SET_DATA_ROLES", response.result.data);
            commit("SET_PAGE_COUNT", response.result.pageCount);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    GetActiveRoles({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getActiveRoles(filter)
          .then((response) => {
            commit("SET_ACTIVE_ROLES", response.result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    InsertRole({ commit }, item) {
      return new Promise((resolve, reject) => {
        insertRole(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    UpdateRole({ commit }, item) {
      return new Promise((resolve, reject) => {
        updateRole(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ActivationRole({ commit }, item) {
      return new Promise((resolve, reject) => {
        activationRole(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    DeleteRole({ commit }, item) {
      return new Promise((resolve, reject) => {
        deleteRole(item)
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
