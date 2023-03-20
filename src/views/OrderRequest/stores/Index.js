import {
  getOrderRequests,
  insertOrderRequest,
  updateOrderRequest,
  deleteOrderRequest,
  sendOrderRequest,
  approvedOrderRequest,
  rejectOrderRequest,
} from "../Apis/Index.js";

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

    editedItem: {
      id: null,
      note: null,
      orderRequestType: null,
      branchId: null,
      printOutCenter:false,
    },

    defaultItem: {
      id: null,
      note: null,
      orderRequestType: null,
      branchId: null,
      printOutCenter:false,
    },
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

    RESET_DATA(state) {
      state.editedItem = Object.assign({}, state.defaultItem);
    },

    SET_ITEM_ORDER_REQUEST(state, item) {
      state.editedItem.id = item.id;
      state.editedItem.note = item.note;
      state.editedItem.orderRequestType = item.orderRequestType;
      state.editedItem.branchId = item.branchId;
    },
  },

  actions: {
    ClearDataItem({ commit }) {
      commit("RESET_DATA");
    },

    SetDataUpdate({ commit }, item) {
      commit("SET_ITEM_ORDER_REQUEST", item);
    },

    GetOrderRequests({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getOrderRequests(filter)
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

    InsertOrderRequest({ commit, state ,rootState}) {

      const data= {
        
        note: state.editedItem.note,
        orderRequestType: state.editedItem.orderRequestType,
        branchId: state.editedItem.branchId ?? rootState.auth.userInfo.branchId,
        printOutCenter:state.editedItem.printOutCenter,
      };

      return new Promise((resolve, reject) => {
        insertOrderRequest(data)
          .then((response) => {
            commit("RESET_DATA");
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    UpdateOrderRequest({ commit, state,rootState }) {
      const data= {
        id: state.editedItem.id,
        note: state.editedItem.note,
        orderRequestType: state.editedItem.orderRequestType,
        branchId: state.editedItem.branchId ?? rootState.auth.userInfo.branchId,
        printOutCenter:state.editedItem.printOutCenter,
      };
      return new Promise((resolve, reject) => {
        updateOrderRequest(data)
          .then((response) => {
            commit("RESET_DATA");
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    DeleteOrderRequest({ commit }, item) {
      const param = {
        orderRequestId: item.orderRequestId,
      };
      return new Promise((resolve, reject) => {
        deleteOrderRequest(param)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    SendOrderRequest({ commit }, item) {
      return new Promise((resolve, reject) => {
        sendOrderRequest(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    ApprovedOrderRequest({ commit }, item) {
      return new Promise((resolve, reject) => {
        approvedOrderRequest(item)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    RejectOrderRequest({ commit }, item) {
      return new Promise((resolve, reject) => {
        rejectOrderRequest(item)
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
