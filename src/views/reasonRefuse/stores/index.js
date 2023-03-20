import {
  getReasonRefuses,
  getActiveReasonRefuses,
  activationReasonRefuse,
  deleteReasonRefuse,
  insertReasonRefuse,
  updateReasonRefuse,
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
    activeReasonRefuses: [],
    pageCount: 0,
  },

  getters: {
    getDataFields,
  },

  mutations: {
    updateDataField,

    SET_DATA_REASON_REFUSES(state, items) {
      state.grids = items;
    },

    SET_DATA_ACTIVE_REASON_REFUSES(state, items) {
      state.activeReasonRefuses = items;
    },

    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },
  },

  actions: {
    GetReasonRefuses({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getReasonRefuses(filter)
          .then((response) => {
            commit("SET_DATA_REASON_REFUSES", response.result.data);
            commit("SET_PAGE_COUNT", response.result.pageCount);

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    GetActiveReasonRefuses({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getActiveReasonRefuses(filter)
          .then((response) => {
            commit("SET_DATA_ACTIVE_REASON_REFUSES", response.result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    InsertReasonRefuse({ commit }, item) {
      return new Promise((resolve, reject) => {
        insertReasonRefuse(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    UpdateReasonRefuse({ commit }, item) {
      return new Promise((resolve, reject) => {
        updateReasonRefuse(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ActivationReasonRefuse({ commit }, item) {
      const param = {
        reasonRefuseId: item.id,
        isActive: item.isActive,
      };
      return new Promise((resolve, reject) => {
        activationReasonRefuse(param)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    DeleteReasonRefuse({ commit }, item) {
      return new Promise((resolve, reject) => {
        deleteReasonRefuse(item)
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
