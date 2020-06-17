import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import io from 'socket.io-client'

Vue.config.productionTip = false

//Establish connection to backend
const http = axios.create({ baseURL: 'http://192.168.1.15:8282' })

//Create a socket
const socket = io('http://localhost');

Vue.prototype.$http = http;

new Vue({
  socket,
  render: h => h(App),
}).$mount('#app')
