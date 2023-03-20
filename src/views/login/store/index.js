import { routes } from "../../../router";

import { login, getInfoUser,chenagePassword,getXAntiForgery} from "../api";
import {
  getToken,
  setToken,
  removeToken,
  setUserInfo,
  getUserInfo,
  SetXAntiForgery,
  getXAntiForgeryWithKey,
} from "../../../util/session";

import { createHelpers } from "vuex-map-fields";
const { getDataFields, updateDataField } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

export function hasPermission(userPermisstions, meta) {
  return userPermisstions.some((item) => meta.includes(item));
}

export function filterAsyncRoutes(authBaseRoutes, userPermisstions) {
  const res = [];
  authBaseRoutes.forEach((predRoute) => {
    const route = { ...predRoute };
    if (!route.hidden) {
      if (route.children) {
        route.children.forEach((predChildren) => {
          var metaAllow = predChildren.meta.some((item) => item == "Allow");
          if (metaAllow) {
            predChildren.disabled = true;
            if (route.children.length == 1) route.disabled = true;
          } else {
            if (route.children.length == 1) {
              route.disabled = hasPermission(
                userPermisstions,
                predChildren.meta
              );
              predChildren.disabled = route.disabled;
            } else {
              predChildren.disabled = hasPermission(
                userPermisstions,
                predChildren.meta
              );
            }
          }
        });

        res.push(route);
      }
    }
  });
  return res;
}

export default {
  namespaced: true,
  state: {
    routes: [],
    tokenId: getToken(),
    XAntiForgeryToken: getXAntiForgeryWithKey(),
    roles: [],
    group: [],
    userInfo: {},
  },

  getters: {
    getDataFields,
    isAuthenticated(state) {
      return state.tokenId !== null;
    },
    getToken(state) {
      return state.tokenId;
    },
    getXAntiForgeryToken(state) {
      return state.XAntiForgeryToken;
    },

    getRole(state) {
      return state.roles ?? [];
    },

    getInfo(state) {
      return state.userInfo ?? {};
    },
  },

  mutations: {
    updateDataField,
    SET_TOKEN: (state, token) => {
      state.tokenId = token;
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles;
    },

    SET_USER_INFO(state, userinfo) {
      state.userInfo = userinfo;
    },

    SET_ROUTES(state) {
      let routerBeforFilter = JSON.parse(JSON.stringify(routes));
      state.routes = filterAsyncRoutes(routerBeforFilter, state.roles);
    },
    clearAuthData(state) {
      state.tokenId = null;
      state.routes = [];
      state.userInfo = {};
    },
  },

  actions: {
    GetXAntiForgery({ commit }) {
      return new Promise((resolve, reject) => {
        getXAntiForgery()
          .then((response) => {
            SetXAntiForgery(response.result)
            console.log(response);
            console.log(commit);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    login({ commit }, authData) {
      const { nameOrNumber, password } = authData;
      return new Promise((resolve, reject) => {
        login({ nameOrNumber: nameOrNumber, password: password })
          .then((response) => {
            commit("SET_TOKEN", response.result.accessToken);
            commit("SET_ROLES", response.result.permisstions);
            commit("SET_USER_INFO", response.result);
            // setToken(response.result.accessToken);
            // setUserInfo(response.result);
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    ResetPassword({ commit }, chengeDate) {
      const data = {
        employeeNumber: chengeDate.employeeNumber,
        password: chengeDate.passwordNew,
        userId:chengeDate.userId
      };
      return new Promise((resolve, reject) => {
        chenagePassword(data)
          .then(() => {
            console.log(commit)
            resolve();
          })
          .catch((error) => {
            reject(error);
          });
      });
    },
    SetTokenLoginUser({ commit }, result) {
      setToken(result.accessToken);
      setUserInfo(result);
      console.log(result);
      console.log(commit);
    },

    getUserInfoSesstion({ commit }) {
      getUserInfo().then((response) => {
        commit("SET_USER_INFO", response);
        commit("SET_ROLES", response?.permisstions);
        commit("SET_ROUTES");
      });
    },
    getInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getInfoUser()
          .then((response) => {
            const { result } = response;

            if (!result) {
              reject("الرجاء إعادة تسجيل الدخول من جديد");
            }

            const { permisstions } = result;

            if (!permisstions || permisstions.length <= 0) {
              reject("لايوجد صلاحية للمستخدم الرجاء إعادة التسجيل الدخول");
            }

            commit("SET_ROLES", permisstions);
            commit("SET_USER_INFO", result);

            resolve(result);
          })
          .catch((error) => {
            reject(error);
          });
      });
    },

    logout({ commit }) {
      commit("clearAuthData");
      removeToken();
    },

    tryAutoLogin({ commit }) {
      const token = getToken();
      if (!token) {
        return Promise.reject("no token");
      }
      commit("SET_TOKEN", {
        token: token,
      });
      return Promise.resolve(true);
    },
  },
};
