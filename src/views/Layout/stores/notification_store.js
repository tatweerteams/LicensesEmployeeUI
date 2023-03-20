export default {
  namespaced: true,
  state: {
    notificationCount: 0,
  },

  getters: {
    GET_NOTIFICATION_CAOUNT(state) {
      return state.notificationCount;
    },
  },

  mutations: {
    SET_NOTIFICATION_CAOUNT: (state, data) => {
      state.notificationCount = data;
    },
  },

  actions: {
    getNotificationCount({ commit }, notificationCount) {
      return new Promise(() => {
        commit("SET_NOTIFICATION_CAOUNT", notificationCount);
      });
    },
  },
};
