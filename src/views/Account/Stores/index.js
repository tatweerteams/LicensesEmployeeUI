import {
  getAccounts,
  insertAccount,
  insertAccounts,
  updateAccount,
  deleteAccount,
  activateAccount,
  activatePrintExternally,
} from "../Apis/index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
getterType: "getDataFields",
mutationType: "updateDataField",
});

export default {
  namespaced: true,
  state: {
    grids: [],
    
    excelData: [],

    activeBranchs: [],
    pageCount: 0,
    
    editedItem: {
      id: null,
      accountName: null,
      accountNo: null,
      branchId:null,
      accountType: null,
      accountState:null,
      phoneNumber:null,
      inputType:null,
    },
    
    defaultItem: {
      id: null,
      accountName: null,
      accountNo: null,
      branchId:null,
      accountType: null,
      accountState:null,
      phoneNumber:null,
      inputType:null,
    },
  },

  getters: {
    getDataFields,
  },

  mutations: {
    updateDataField,

    SET_DATA_ACCOUNTS(state, items) {
      state.grids = items;
    },

    SET_DATA_ACTIVE_ACCOUNTS(state, items) {
      state.activeBranchs = items;
    },

    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },

    RESET_DATA(state) {
      state.editedItem = Object.assign({}, state.defaultItem);
    },

    RESET_EXCEL_DATA(state) {
      state.excelData = [];
    },
    
    SET_ITEM_ACCOUNTS(state, item) {
      state.editedItem.id = item.id;
      state.editedItem.accountName = item.accountName;
      state.editedItem.accountNo = item.accountNo;
      state.editedItem.branchId = item.branchId;
      state.editedItem.accountType = item.accountTypeValue;
      state.editedItem.accountState = item.accountState;
      state.editedItem.phoneNumber = item.phoneNumber;
    },

  },

  actions: {

    ClearDataItem({ commit }) {
      commit("RESET_DATA");
    },

    ClearExcelData({ commit }) {
      commit("RESET_EXCEL_DATA");
    },

    InsertAccount({ commit, state }) {
      return new Promise((resolve, reject) => {
        insertAccount(state.editedItem)
          .then((response) => {
            commit("RESET_DATA");
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    InsertListOfAccounts({ commit, state }) {
      return new Promise((resolve, reject) => {
        insertAccounts(state.excelData)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    UpdateAccount({ commit, state }) {
      let updateModel = {
        Id : state.editedItem.id,
        AccountName : state.editedItem.accountName,
        AccountNo : state.editedItem.accountNo,
        BranchId : state.editedItem.branchId,
        AccountType : state.editedItem.accountType,
        PhoneNumber : state.editedItem.phoneNumber,
      };

      return new Promise((resolve, reject) => {
        updateAccount(updateModel)
          .then((response) => {
            commit("RESET_DATA");
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    DeleteAccount({ commit }, item) {
      const param = {
        id: item.id
      };
      return new Promise((resolve, reject) => {
        deleteAccount(param)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ActivateAccount({ commit }, item) {
      const param = {
        id: item.id,
        accountState: item.accountStateValue
      };
      return new Promise((resolve, reject) => {
        activateAccount(param)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ActivatePrintExternally({ commit }, item) {
      const param = {
        id: item.id,
        status: item.printExternally
      };
      return new Promise((resolve, reject) => {
        activatePrintExternally(param)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    SetDataUpdate({ commit }, item) {
      commit("SET_ITEM_ACCOUNTS", item);
    },

    GetAccounts({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getAccounts(filter)
          .then((response) => {
            commit("SET_DATA_ACCOUNTS", response.result.data);
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