import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import SocketIO from 'socket.io-client'
import VueSocketIOExt from 'vue-socket.io-extended'
import VueMq from 'vue-mq'

Vue.config.productionTip = false

//Establish connection to backend
const http = axios.create({ baseURL: 'http://192.168.1.15:4113' })

//Establish a socket connection
const socket = SocketIO('http://192.168.1.15:4113');

//Initialize vue socket client
Vue.use(VueSocketIOExt, socket);
Vue.prototype.$http = http;
Vue.use(VueMq, { breakpoints: { sm: 450, md: 1000, lg: Infinity } })

// Vue.prototype.$socket = socket;
new Vue({
  render: h => h(App),
}).$mount('#app')
