import {
  getOrderItems,
  deleteOrderItem,
  updateOrderItem,
 
} from "../apis/index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  namespaced: true,
  state: {
    orderRequest: null,
    orderItems: [],
    pageCount: 0,
  },

  getters: {
    getDataFields,
  },

  mutations: {
    updateDataField,

    SET_DATA_ORDER_REQUEST(state, orderRequest) {
      state.orderRequest = orderRequest;
    },
    SET_DATA_ORDER_ITEMS(state, orderItems) {
      state.orderItems = orderItems;
    },

    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },
  },

  actions: {
    GetOrderItems({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getOrderItems(filter)
          .then((response) => {
            commit("SET_DATA_ORDER_REQUEST", response.result.orderRequest);
            commit("SET_DATA_ORDER_ITEMS", response.result.orderItems);
            commit("SET_PAGE_COUNT", response.result.pageCount);

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    UpdateOrderItem({ commit }, item) {
      return new Promise((resolve, reject) => {
        updateOrderItem(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

  

    DeleteOrderItem({ commit }, item) {
      return new Promise((resolve, reject) => {
        deleteOrderItem(item)
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
