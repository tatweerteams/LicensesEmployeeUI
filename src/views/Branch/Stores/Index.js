import {
  getBranchs,
  getActiveBranchs,
  insertBranch,
  updateBranch,
  activationBranch,
  deleteBranch,
  getBranchSetting,
  updateBranchSetting,
} from "../API/Index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  namespaced: true,
  state: {
    branchs: [],
    activeBranchs: [],
    branchWorkTimes: [],
    pageCount: 0,

    isEmpty: false,

    editedItem: {
      id: null,
      name: null,
      branchNo: null,
      branchRegionId: null,
      lastSerialCertified: 0,
      lastSerial: 0,
      lastCountChekBook: 0,
      branchSetting: {
        id: null,
        accountChekBook: null,
        companyFrom: 1,
        companyTo: 1000,
        certifiedFrom: 1,
        certifiedTo: 1000,
        individualFrom: 1,
        individualTo: 1000,
        individualRequestAccountDay: true,
        individualQuentityOfDay: 1,
        branchRequestCountOfDay: 10,
        orderRequestAuthorization: true,
      },
    },

    defaultItem: {
      id: null,
      name: null,
      branchNo: null,
      branchRegionId: null,
      lastSerialCertified: 0,
      lastSerial: 0,
      lastCountChekBook: 0,
      branchSetting: {
        id: null,
        accountChekBook: null,
        companyFrom: 1,
        companyTo: 1000,
        certifiedFrom: 1,
        certifiedTo: 1000,
        individualFrom: 1,
        individualTo: 1000,
        individualRequestAccountDay: true,
        individualQuentityOfDay: 1,
        branchRequestCountOfDay: 10,
        orderRequestAuthorization: true,
      },
    },
  },

  getters: {
    getDataFields,

    GET_ACTIVE_BRANCHS(state) {
      return state.activeBranchs;
    },
  },

  mutations: {
    updateDataField,

    SET_DATA_BRANCHS(state, items) {
      state.branchs = items;
    },

    SET_DATA_BRANCH_SETTING(state, item) {
      state.editedItem.branchSetting = Object.assign({}, item);
    },

    SET_DATA_ACTIVE_BRANCHS(state, items) {
      state.activeBranchs = items;
    },

    SET_PAGE_COUNT(state, pageCount) {
      state.pageCount = pageCount;
    },

    RESET_DATA(state) {
      state.editedItem = Object.assign({}, state.defaultItem);
      state.editedItem.branchSetting = Object.assign(
        {},
        state.defaultItem.branchSetting
      );
      state.isEmpty = false;
      state.branchWorkTimes = [];
    },
    SET_ITEM_BRANCH(state, item) {
      state.editedItem.id = item.id;
      state.editedItem.name = item.name;
      state.editedItem.branchNo = item.branchNo;
      state.editedItem.branchRegionId = item.branchRegionId;
      state.editedItem.lastCountChekBook = item.lastCountChekBook;
      state.editedItem.lastSerialCertified = item.lastSerialCertified;
      state.editedItem.lastSerial = item.lastSerial;
    },

    SET_IS_EMPTY(state) {
      state.isEmpty = true;
    },

    SET_Branch_ITEM_LIST(state, item) {
      state.activeBranchs = [];
      state.activeBranchs.push(item);
    },
  },

  actions: {
    ClearDataItem({ commit }) {
      commit("RESET_DATA");
    },

    SetDataUpdate({ commit }, item) {
      commit("SET_ITEM_BRANCH", item);
    },

    SetBranchItemList({ commit }, item) {
      commit("SET_Branch_ITEM_LIST", item);
    },

    GetBranchs({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getBranchs(filter)
          .then((response) => {
            commit("SET_DATA_BRANCHS", response.result.data);
            commit("SET_PAGE_COUNT", response.result.pageCount);

            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    GetBranchSetting({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getBranchSetting(filter)
          .then((response) => {
            if (!response.result) {
              commit("SET_IS_EMPTY");
              resolve(response);
              return;
            }

            commit("SET_DATA_BRANCH_SETTING", response.result);

            resolve(response);
          })
          .catch((error) => {
            commit("SET_IS_EMPTY");
            reject(error);
          });
      });
    },

    GetActiveBranchs({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getActiveBranchs(filter)
          .then((response) => {
            commit("SET_DATA_ACTIVE_BRANCHS", response.result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    InsertBranch({ commit, state, rootState }) {
      const data = {
        name: state.editedItem.name,
        branchNo: state.editedItem.branchNo,
        branchRegionId:
          state.editedItem.branchRegionId ?? rootState.auth.userInfo.regionId,
        lastCountChekBook: state.editedItem.lastCountChekBook,
        lastSerialCertified: state.editedItem.lastSerialCertified,
        lastSerial: state.editedItem.lastSerial,
        branchSetting:state.editedItem.branchSetting,
      };

      return new Promise((resolve, reject) => {
        insertBranch(data)
          .then((response) => {
            commit("RESET_DATA");
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    UpdateBranch({ commit, state }) {
      const data = state.editedItem;

      return new Promise((resolve, reject) => {
        updateBranch(data)
          .then((response) => {
            commit("RESET_DATA");
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    UpdateBranchSetting({ commit, state }) {
      const data = state.editedItem.branchSetting;

      return new Promise((resolve, reject) => {
        updateBranchSetting(data)
          .then((response) => {
            commit("RESET_DATA");
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ActivationBranch({ commit }, item) {
      const param = {
        branchId: item.id,
        isActive: item.isActive,
      };
      return new Promise((resolve, reject) => {
        activationBranch(param)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    DeleteBranch({ commit }, item) {
      return new Promise((resolve, reject) => {
        deleteBranch(item)
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
