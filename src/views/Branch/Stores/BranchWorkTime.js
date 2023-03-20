import {
  getBranchWorkTime,
  updateBranchWorkTime,
  activationBranchWorkTime,
  updateAllWorkTime,
} from "../API/Index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  namespaced: true,
  state: {
    branchWorkTimes: [],
    isEmpty: false,
  },

  getters: {
    getDataFields,
  },

  mutations: {
    updateDataField,

    SET_DATA_BRANCH_WORK_TIME(state, items) {
      state.branchWorkTimes = items;
    },
    RESET_DATA(state) {
      state.isEmpty = false;
      state.branchWorkTimes = [];
    },

    SET_IS_EMPTY(state, item) {
      state.isEmpty = item;
    },
  },

  actions: {
    ClearDataItem({ commit }) {
      commit("RESET_DATA");
    },

    GetBranchWorkTime({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getBranchWorkTime(filter)
          .then((response) => {
            if (response.result.length == 0) {
              commit("SET_IS_EMPTY", true);
              resolve(response);
              return;
            }
            commit("SET_DATA_BRANCH_WORK_TIME", response.result);
            resolve(response);
          })
          .catch((error) => {
            commit("SET_IS_EMPTY", true);
            reject(error);
          });
      });
    },
    UpdateBranchWorkTime({ commit }, data) {
      return new Promise((resolve, reject) => {
        updateBranchWorkTime(data)
          .then((response) => {
            console.log(commit);
            commit("SET_IS_EMPTY", false);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            commit("SET_IS_EMPTY", true);
            reject(error);
          });
      });
    },

    ActivationBranchWorkTime({ commit }, item) {
      const param = {
        branchWorkTimeId: item.id,
        isActive: item.isActive,
      };
      return new Promise((resolve, reject) => {
        activationBranchWorkTime(param)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    UpdateAllWorkTime({ commit }, item) {
      return new Promise((resolve, reject) => {
        updateAllWorkTime(item)
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
