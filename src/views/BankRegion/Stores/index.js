import {
  getBankRegions,
  activationBankRegion,
  deleteBankRegion,
  insertBankRegion,
  getActiveBankRegions,
} from "../Apis/index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  namespaced: true,
  state: {
    bankRegions: [],
    activeBankRegions: [],
  },

  getters: {
    getDataFields,

    GET_ACTIVE_BANKREGIONS(state) {
      return state.activeBankRegions;
    },
  },

  mutations: {
    updateDataField,

    SET_DATA_BANK_REGIONS(state, items) {
      state.bankRegions = items;
    },
    SET_DATA_ACTIVE_BANK_REGIONS(state, items) {
      state.activeBankRegions = items;
    },
    DELETE_BANK_REGION_SUCCESS(state, bankRegionId) {
      let rergion = state.bankRegions.find(
        (pred) => pred.bankRegionId == bankRegionId
      );

      state.bankRegions.splice(state.bankRegions.indexOf(rergion), 1);
    },
    SET_BANK_REGION_ITEM_LIST(state, item) {
      state.activeBankRegions = [];
      state.activeBankRegions.push(item);
    },
  },

  actions: {
    SetBankRegionItemList({ commit }, item) {
      commit("SET_BANK_REGION_ITEM_LIST", item);
    },
    GetBankRegions({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getBankRegions(filter)
          .then((response) => {
            commit("SET_DATA_BANK_REGIONS", response.result.data);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    GetActiveBankRegions({ commit, rootState }, filter) {
      filter.bankId = filter?.bankId ?? rootState.auth.userInfo.bankId;

      return new Promise((resolve, reject) => {
        if (!filter.bankId) reject("");
        getActiveBankRegions(filter)
          .then((response) => {
            commit("SET_DATA_ACTIVE_BANK_REGIONS", response.result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    InsertBankRegion({ commit, dispatch }, item) {
      const data = {
        bankId: item.bankId,
        regionId: item.regionId,
      };

      return new Promise((resolve, reject) => {
        insertBankRegion(data)
          .then((response) => {
            console.log(commit);
            dispatch("bankStore/GetBanks", null, { root: true });
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ActivationBankRegion({ commit }, item) {
      const param = {
        bankRegionId: item.bankRegionId,
        isActive: item.isActive,
      };
      return new Promise((resolve, reject) => {
        activationBankRegion(param)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    DeleteBankRegion({ commit, dispatch }, item) {
      const param = {
        bankRegionId: item.bankRegionId,
      };
      return new Promise((resolve, reject) => {
        deleteBankRegion(param)
          .then((response) => {
            console.log(commit);

            dispatch("bankStore/GetBanks", null, { root: true });
            resolve(response.messages[0]);
            
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
