import Vue from "vue";
import Vuex from "vuex";
import auth from "../views/login/store";
import regionStore from "../views/Region/Stores/index.js";
import bankStore from "../views/Bank/Stores/index.js";
import bankRegionStore from "../views/BankRegion/Stores/index.js";
import branchStore from "../views/Branch/Stores/Index.js";
import branchWorkTimeStore from "../views/Branch/Stores/BranchWorkTime.js";
import orderRequestStore from "../views/OrderRequest/stores/Index.js";
import orderRequestPindingStore from "../views/orderRequestPinding/stores/index.js";
import orderItemStore from "../views/OrderRequestItem/stores/index.js";
import orderPindingItemStore from "../views/orderRequestPinding/stores/orderPindingItemStore.js";
import insertAccountOrderItemStore from "../views/OrderRequestItem/stores/insertAccountItem.js";
import orderRequestRejectStore from "../views/orderRequestReject/stores/index.js";
import rejectNoteStore from "../views/orderRequestReject/stores/rejectNoteStore.js";
import reasonRefuseStore from "../views/reasonRefuse/stores/index.js";
import accountRequestReportStore from "../views/reports/stores/accountRequestReportStore.js";
import employeeReportStore from "../views/reports/stores/empolyeeReportStore.js";
import branchOrderReportStore from "../views/reports/stores/branchOrderReportStore.js";
import statisticBranchReportStore from "../views/reports/stores/statisticBranchReportStore.js";
import orderRequestPriteOutStore from "../views/reports/stores/orderRequestPriteOutStore";
import accountStore from "../views/Account/Stores/index.js";
import excelAccountsStore from "../views/Account/Stores/excelAccounts.js";

import permisstionStore from "../views/userManagment/permisstion/stores/index.js";
import roleStore from "../views/userManagment/role/stores/index.js";
import userStore from "../views/userManagment/user/stores/index.js";
import loggingStore from "../views/Logging/Store/index.js"


Vue.use(Vuex);

export default new Vuex.Store({
  strict: true,
  state: {
    setloading: false,
    notificationText: "",
    notificationColor: "",
  },
  mutations: {
    setLoading(state, value) {
      state.setloading = value;
    },
    showMessage(state, value) {
      (state.notificationText = value.text),
        (state.notificationColor = value.color);
    },
  },
  actions: {
    loading({ commit }, value) {
      commit("setLoading", value);
    },
  },
  modules: {
    auth,
    regionStore,
    bankStore,
    bankRegionStore,
    branchStore,
    branchWorkTimeStore,
    orderRequestStore,
    orderItemStore,
    insertAccountOrderItemStore,
    orderRequestPindingStore,
    orderPindingItemStore,
    orderRequestRejectStore,
    rejectNoteStore,
    reasonRefuseStore,
    permisstionStore,
    roleStore,
    userStore,
    accountRequestReportStore,
    employeeReportStore,
    branchOrderReportStore,
    statisticBranchReportStore,
    orderRequestPriteOutStore,
    accountStore,
    excelAccountsStore,
    loggingStore,
  },
});
