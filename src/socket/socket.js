import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import Vue from 'vue'

const socket = io(
    'http://localhost:5000/'
    // 'https://colearn-tech.herokuapp.com/'
)
export const socketBus = Vue.use(VueSocketIOExt, socket)
