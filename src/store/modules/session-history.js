import axios from "axios";
import ENUM from "@/enums/firebase_enum"
const http = axios.create({
    baseURL:
        // "http://localhost:5000/session"
        'https://colearn-tech.herokuapp.com/session'
    ,
});
export const sessionHistory = {
    state: {
        sessionHistory: {
            count: null,
            commands: [],
            loaded: ENUM.INIT
        }
    },
    getters: {
        sessionHistory(state) {
            return state.sessionHistory.commands;
        },
        loadState(state) {
            return state.sessionHistory.loaded;
        }
    },
    mutations: {
        SET_COMMANDS(state, values) {
            state.sessionHistory.commands = values;
            state.sessionHistory.count = values != null ? values.length : null;
        }
    },
    actions: {
        getSessionHistory({ state, commit, rootState }, sessionId) {
            if (rootState.user.authenticated && state) {
                state.sessionHistory.loaded = ENUM.LOADING;
                let commands = [];
                http.get('/sql/get-history', { params: { sessionId: sessionId } }).then((res) => {
                    commands = res.data;
                    commit('SET_COMMANDS', commands)
                    state.sessionHistory.loaded = ENUM.LOADED;
                })
            } else {
                commit('SET_COMMANDS', null)
                state.sessionHistory.loaded = ENUM.ERROR;
            }
        }
    }
}