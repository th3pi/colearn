import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import SocketIO from 'socket.io-client'

Vue.config.productionTip = false

//Establish connection to backend
const http = axios.create({ baseURL: 'http://192.168.1.15:4113' })

const socket = SocketIO('http://localhost:4113');

Vue.prototype.$http = http;
Vue.prototype.$socket = socket;
new Vue({
  render: h => h(App),
}).$mount('#app')
