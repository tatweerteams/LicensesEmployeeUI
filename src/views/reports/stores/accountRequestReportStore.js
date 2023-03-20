import { getAccountRequestReport } from "../apis/index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  namespaced: true,
  state: {
    accountRequestReports: [],
    pageCount: 0, 
  },

  getters: {
    getDataFields,
  },

  mutations: {
    updateDataField,

    SET_DATA_ACCOUNT_REQUEST_REPORTS(state, datas) {
      state.accountRequestReports = datas;
    },
    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },
  },

  actions: {
    GetAccountRequestReport({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getAccountRequestReport(filter)
          .then((response) => {
            commit("SET_DATA_ACCOUNT_REQUEST_REPORTS", response.result.data);
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
