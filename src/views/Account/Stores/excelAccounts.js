import {
    insertAccounts,
} from "../Apis/index.js";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
    getterType: "getDataFields",
    mutationType: "updateDataField",
});

export default {
    namespaced: true,
    state: {
        excelData: [],
        excelBranchId: null,
    },

    getters: {
        getDataFields,
    },

    mutations: {
        updateDataField,

        RESET_EXCEL_DATA(state) {
            state.excelData = [];
            state.excelBranchId = null;
        },

    },

    actions: {

        ClearExcelData({ commit }) {
            commit("RESET_EXCEL_DATA");
        },

        InsertListOfAccounts({ commit, state }) {
            return new Promise((resolve, reject) => {
                let dto = {
                    "insertModel": state.excelData,
                    "branchId": state.excelBranchId
                }
                insertAccounts(dto)
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