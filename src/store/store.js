import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";

//Initial Vuex state management
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {
      authenticated: false,
      data: null,
      details: null,
      beta: false,
    },
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
    },
    SET_USER_DETAILS(state, details) {
      state.user.details = details;
    },
    SET_BETA(state, value) {
      state.user.beta = value;
    },
  },
  actions: {
    fetchUser({ commit }, user) {
      commit("SET_AUTHENTICATED", user != null);
      if (user) {
        commit("SET_USER", {
          displayName: user.displayName,
          email: user.email,
        });
      } else {
        commit("SET_USER", null);
      }
    },
    fetchDetails({ commit }, details) {
      commit("SET_USER_DETAILS", details);
    },
    giveAccess({ commit }, value) {
      commit("SET_BETA", value);
    },
  },
  plugins: [
    createPersistedState({
      storage: window.sessionStorage,
    }),
  ],
});
