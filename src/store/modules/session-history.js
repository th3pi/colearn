import axios from "axios";
import ENUM from "@/enums/firebase_enum"
import Vue from 'vue'
const http = axios.create({
    baseURL:
        "http://localhost:5000/session"
    // 'https://colearn-tech.herokuapp.com/session'
    ,
});
export const sessionHistory = {
    state: {
        sessionHistory: {
            count: null,
            commands: [],
            loaded: ENUM.INIT,
            tabs: {
                tables: [],
                count: null,
            }
        }
    },
    getters: {
        sessionHistory(state) {
            return state.sessionHistory.commands;
        },
        loadState(state) {
            return state.sessionHistory.loaded;
        },
        tabs(state) {
            return state.sessionHistory.tabs;
        }
    },
    mutations: {
        SET_COMMANDS(state, values) {
            state.sessionHistory.commands = values;
            state.sessionHistory.count = values != null ? values.length : null;
        },
        ADD_COMMAND(state, value) {
            let arr = state.sessionHistory.commands;
            arr.unshift(value);
            Vue.set(state.sessionHistory, 'commands', arr)
        },
        SET_TABS(state, value) {
            state.sessionHistory.tabs = value;
        },
        ADD_TAB(state, value) {
            state.sessionHistory.tabs.push(value);
        }
    },
    actions: {
        getSessionHistory({ state, commit, rootState }, sessionId) {
            if (rootState.user.authenticated && state) {
                state.sessionHistory.loaded = ENUM.LOADING;
                let commands = [];
                http.get('/sql/get-history', { params: { sessionId: sessionId, limit: 10 } }).then((res) => {
                    commands = res.data;
                    commit('SET_COMMANDS', commands)
                    state.sessionHistory.loaded = ENUM.LOADED;

                })
            } else {
                commit('SET_COMMANDS', null)
                state.sessionHistory.loaded = ENUM.ERROR;
            }
        },
        addCommand({ state, commit, rootState }, command) {
            if (rootState.user.authenticated && state) {
                commit('ADD_COMMAND', command);
            }
        },
        setTabs({ state, commit, rootState }, tabs) {
            if (rootState.user.authenticated && state) {
                commit('SET_TABS', tabs);
            }
        }
    }
}