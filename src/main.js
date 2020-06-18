import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueSocketIO from 'vue-socket.io'

Vue.config.productionTip = false

//Establish connection to backend
const http = axios.create({ baseURL: 'http://192.168.1.15:8282' })

Vue.prototype.$http = http;


Vue.use(new VueSocketIO({
  debug: true,
  connection: 'http://localhost:3000'
}))

new Vue({
  render: h => h(App),
}).$mount('#app')
