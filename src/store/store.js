import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import { sessionHistory } from "./modules/session-history"
import { sqlSocket } from "./modules/sql-socket"
import ENUM from "@/enums/store_enum"

//Initial Vuex state management
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    sessionHistory,
    sqlSocket,
  },
  state: {
    user: {
      authenticated: false,
      data: null,
      details: null,
      beta: false,
      activeSession: null,
    },
    storeApi: {
      state: ENUM.INIT
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
  },
  mutations: {
    SET_AUTHENTICATED(state, value) {
      state.user.authenticated = value;
    },
    SET_USER(state, data) {
      state.user.data = data;
      state.storeApi.state = ENUM.LOADED;

    },
    SET_USER_DETAILS(state, details) {
      state.user.details = details;
    },
    SET_USER_VERIFIED(state, value) {
      state.user.data.verified = value;
    },
    SET_BETA(state, value) {
      state.user.beta = value;
    },
    SET_STOREAPI(state, value) {
      state.storeApi.state = value;
    },
    SET_ACTIVE_SESSION(state, value) {
      state.user.activeSession = value;
    }
  },
  actions: {
    fetchUser({ commit }, user) {
      commit("SET_AUTHENTICATED", user != null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email,
          verified: user.emailVerified
        });
        commit("SET_STOREAPI", ENUM.LOADED);
      } else {
        commit("SET_USER", null);
      }
    },
    fetchDetails({ commit }, details) {
      commit("SET_USER_DETAILS", details);
      commit("SET_STOREAPI", ENUM.LOADED);
    },
    giveAccess({ commit }, value) {
      commit("SET_BETA", value);
    },
    setActiveSession({ commit }, value) {
      commit("SET_ACTIVE_SESSION", value);
    },
    setVerified({ commit }, value) {
      commit("SET_USER_VERIFIED", value);
    }
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
