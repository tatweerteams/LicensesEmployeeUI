import {
  getRegions,
  insertRegion,
  updateRegion,
  deleteRegion,
  getRegionUnSelectedBank,
} from "../Apis/index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  namespaced: true,
  state: {
    regions: [],
    regionUnSelectBank: [],
    editedItem: {
      regionName: null,
      regionNumber: null,
      regionId: null,
    },
    defaultItem: {
      regionName: null,
      regionNumber: null,
      regionId: null,
    },
  },

  getters: {
    getDataFields,
  },

  mutations: {
    updateDataField,

    SET_DATA_REGIONS(state, regions) {
      state.regions = regions;
    },
    SET_DATA_REGION_UN_SELECTED(state, regions) {
      state.regionUnSelectBank = regions;
    },
    RESET_DATA(state) {
      state.editedItem = Object.assign({}, state.defaultItem);
    },
    SET_DATA_REGION(state, itemRegion) {
      state.editedItem = Object.assign({}, itemRegion);
    },
  },

  actions: {
    ClearDataItem({ commit }) {
      commit("RESET_DATA");
    },

    SetDataUpdate({ commit }, itemRegion) {
      commit("SET_DATA_REGION", itemRegion);
    },

    GetRegions({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getRegions(filter)
          .then((response) => {
            commit("SET_DATA_REGIONS", response.result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    GetRegionsUnSelected({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getRegionUnSelectedBank(filter)
          .then((response) => {
            commit("SET_DATA_REGION_UN_SELECTED", response.result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    InsertRegion({ commit, state }) {
      const data = {
        name: state.editedItem.regionName,
        regionNo: state.editedItem.regionNumber,
      };

      return new Promise((resolve, reject) => {
        insertRegion(data)
          .then((response) => {
            commit("RESET_DATA");
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    UpdateRegion({ commit, state }) {
      const data = {
        name: state.editedItem.regionName,
        regionNo: state.editedItem.regionNumber,
        regionId: state.editedItem.regionId,
      };

      return new Promise((resolve, reject) => {
        updateRegion(data)
          .then((response) => {
            commit("RESET_DATA");
            resolve(response.messages[0]);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    DeleteRegion({ commit }, regionId) {
      const param = {
        regionId: regionId,
      };
      return new Promise((resolve, reject) => {
        deleteRegion(param)
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
