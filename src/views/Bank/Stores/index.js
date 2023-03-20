import {
  getBanks,
  insertBank,
  updateBank,
  activationBank,
  deleteBank,
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
    editedItem: {
      id: null,
      name: null,
      bankNo: null,
      bankRegions: [],
    },

    defaultItem: {
      id: null,
      name: null,
      bankNo: null,
      bankRegions: [],
    },
  },

  getters: {
    getDataFields,
    GET_ACTIVE_BANKS(state)
    {
      return state.grids;
    }
  },

  mutations: {
    updateDataField,

    SET_DATA_BANKS(state, items) {
      state.grids = items;
    },
    RESET_DATA(state) {
      state.editedItem = Object.assign({}, state.defaultItem);
    },
    SET_ITEM_BANK(state, item) {
      state.editedItem.id = item.bankId;
      state.editedItem.bankNo = item.bankNo;
      state.editedItem.name = item.name;
    },
    SET_BANK_ITEM_LIST(state, item)
    {
      state.grids=[];
      state.grids.push(item);
    }
  },

  actions: {
    ClearDataItem({ commit }) {
      commit("RESET_DATA");
    },

    SetDataUpdate({ commit }, item) {
      commit("SET_ITEM_BANK", item);
    },
    
    SetBankItemList({ commit }, item) {
      commit("SET_BANK_ITEM_LIST", item);
    },

    GetBanks({ commit },filter) {
      return new Promise((resolve, reject) => {
        getBanks(filter)
          .then((response) => {
            commit("SET_DATA_BANKS", response.result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    InsertBank({ commit, state }) {
      let regionIds = [];
      state.editedItem.bankRegions.map((item) =>
        regionIds.push({
          regionId: item.regionId,
        })
      );
      const data = {
        name: state.editedItem.name,
        bankNo: state.editedItem.bankNo,
        bankRegions: regionIds,
      };

      return new Promise((resolve, reject) => {
        insertBank(data)
          .then((response) => {
            commit("RESET_DATA");
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    UpdateBank({ commit, state }) {
      const data = {
        name: state.editedItem.name,
        bankNo: state.editedItem.bankNo,
        id: state.editedItem.id,
      };

      return new Promise((resolve, reject) => {
        updateBank(data)
          .then((response) => {
            commit("RESET_DATA");
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ActivateBank({ commit }, item) {
      const param = {
        bankId: item.bankId,
        isActive: item.isActive,
      };
      return new Promise((resolve, reject) => {
        activationBank(param)
          .then((response) => {
            console.log(commit);
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    DeleteBank({ commit }, item) {
      const param = {
        bankId: item.bankId
      };
      return new Promise((resolve, reject) => {
        deleteBank(param)
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
