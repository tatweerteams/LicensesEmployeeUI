import { getRejectNoteByOrderId } from "../apis/index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  namespaced: true,
  state: {
    rejectNote: null,
  },

  getters: {
    getDataFields,
  },

  mutations: {
    updateDataField,

    SET_DATA_REJECT(state, items) {
      state.rejectNote = items;
    },
  },
  actions: {
    GetRejectNoteByOrderId({ commit }, filter) {
      return new Promise((resolve, reject) => {
        getRejectNoteByOrderId(filter)
          .then((response) => {
            commit("SET_DATA_REJECT", response.result);
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
  },
};
