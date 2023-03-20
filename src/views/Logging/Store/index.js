import { getLogs } from "../Api/Index.js";

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

    SET_LOGS(state, items) {
      state.grids = items;
    },
    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },
  },

  actions: {

    GetLogs({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getLogs(filter)
          .then((response) => {
            commit("SET_LOGS", response.result.data);
            commit("SET_PAGE_COUNT", response.result.pageCount);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

  },
};
