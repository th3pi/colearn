import Vue from 'vue'
import Vuex from 'vuex'

//Initial Vuex state management
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {
            authenticated: false,
            data: null,
            details: null,
        }
    },
    getters: {
        user(state) {
            return state.user;
        }
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
        }
    },
    actions: {
        fetchUser({ commit }, user) {
            commit("SET_AUTHENTICATED", user != null);
            if (user) {
                commit("SET_USER", {
                    displayName: user.displayName,
                    email: user.email,
                })
            } else {
                commit("SET_USER", null);
            }
        },
        fetchDetails({ commit }, details) {
            commit("SET_USER_DETAILS", details);
        }

    }
})