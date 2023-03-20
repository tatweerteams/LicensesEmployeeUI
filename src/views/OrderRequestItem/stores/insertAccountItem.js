import {
  getAccountWithOutOrderItem,
  insertOrderItemRequest,
} from "../apis/index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  namespaced: true,
  state: {
    accountWithOutOrderItem: [],
    pageCount: 0,
  },

  getters: {
    getDataFields,
  },

  mutations: {
    updateDataField,

    SET_DATA_ACCOUNT_ITEMS(state, accounts) {
      state.accountWithOutOrderItem = accounts;
    },

    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },
  },

  actions: {
    GetAccountWithOutOrderItem({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getAccountWithOutOrderItem(filter)
          .then((response) => {
            commit("SET_DATA_ACCOUNT_ITEMS", response.result.data);
            commit("SET_PAGE_COUNT", response.result.pageCount);

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    InsertOrderItemRequest({ commit }, data) {
      return new Promise((resolve, reject) => {
        insertOrderItemRequest(data)
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
