import { changeItemState } from "../../OrderRequestItem/apis/index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  namespaced: true,
  state: {},

  getters: {
    getDataFields,
  },

  mutations: {
    updateDataField,
    
  },

  actions: {
    ChangeItemState({ commit }, item) {
      return new Promise((resolve, reject) => {
        changeItemState(item)
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
