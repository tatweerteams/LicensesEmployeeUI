import {
  getOrderRequestReject,
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

    SET_DATA_ORDER_REQUESTS(state, items) {
      state.grids = items;
    },

    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },
  },
  actions: {
    GetOrderRequestReject({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getOrderRequestReject(filter)
          .then((response) => {
            commit("SET_DATA_ORDER_REQUESTS", response.result.data);
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
