import axios from "axios";
const http = axios.create({
    baseURL:
        // "http://localhost:5000/session"
        'https://back.colearn.tech/session'
    ,
});

const getDefaultState = () => {
    return {
        users: null,
        sqlField: null,
        inControl: null,
    }
}

export const sqlSocket = {
    state: {
        socket: {
            users: [],
            sqlField: null,
            inControl: null,
        }
    },
    getters: {
        getSocket(state) {
            return state.socket.users;
        },
        getSocketSqlField(state) {
            return state.socket.sqlField;
        },
        getSocketController(state) {
            return state.socket.inControl;
        }
    },
    mutations: {
        SET_SOCKET_USERS(state, value) {
            state.socket.users = value
        },
        SET_SOCKET_SQLFIELD(state, value) {
            state.socket.sqlField = value
        },
        SET_SOCKET_CONTROLLER(state, value) {
            state.socket.inControl = value
        },
        INIT_SOCKET(state, value) {
            state.socket.users = value.users;
            state.socket.sqlField = value.sqlField;
            state.socket.inControl = value.inControl;
        },
        ADD_USER(state, value) {
            state.socket.users.push(value)
        },
        REMOVE_USER(state, value) {
            state.socket.users.splice(state.socket.users.indexOf(value), 1)
        },
        RESET_STATE(state) {
            Object.assign(state, getDefaultState)
        }
    },
    actions: {
        initSocket({ state, commit, rootState }, socket) {
            if (rootState.user.authenticated && state) {
                commit('INIT_SOCKET', socket)
            } else {
                commit('INIT_SOCKET', null)
            }
        },
        setUsers({ state, commit, rootState }, sessionId) {
            if (rootState.user.authenticated && state) {
                http.get('/sql/get-sockets', { params: { sessionId: sessionId } }).then(res => {
                    commit('SET_SOCKET_USERS', res.data)
                })
            }
        },
        updateUser({ state, commit, rootState }, user) {
            if (rootState.user.authenticated && state) {
                http.post('/sql/update-socket', { sessionId: user.sessionId, username: user.username, status: user.status }).then(() => {
                    http.get('/sql/get-sockets', { params: { sessionId: user.sessionId } }).then(res => {
                        commit('SET_SOCKET_USERS', res.data)
                    })
                })
            }
        },
        resetState({ state, commit, rootState }) {
            if (rootState && state) {
                commit('RESET_STATE')
            }
        }
    }
}
