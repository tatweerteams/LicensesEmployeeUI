import { getBranchReport } from "../apis/index.js";

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

    SET_DATAS(state, datas) {
      state.grids = datas;
    },
    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },
  },

  actions: {
    GetBranchReport({ commit, rootState }, filter) {
      filter.branchId = filter.branchId ?? rootState.auth.userInfo.branchId;
      return new Promise((resolve, reject) => {
        // if (!filter.branchId) resolve();
        getBranchReport(filter)
          .then((response) => {
            commit("SET_DATAS", response.result.data);
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
