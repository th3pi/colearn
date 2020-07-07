import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import VueMq from "vue-mq";
import VueEllipseProgress from "vue-ellipse-progress";
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'
import Popover from 'vue-js-popover'
import Clipboard from 'v-clipboard'
import vueTopprogress from 'vue-top-progress'


import { auth } from "./firebase";
//Navigation router
import { router } from "./router/router";

//State management
import store from "./store/store";

Vue.config.productionTip = false;

//Establish to communciate between components
export const bus = new Vue();

//Establish connection to backend
// const http = axios.create({
//   baseURL: "https://us-central1-co-learn-a05d9.cloudfunctions.net/app",
// });

/**
 * This axios instantiation is for dev-build testing only. Comment out before production
 */
const http = axios.create({
  baseURL:
    // "http://localhost:5000/"
    'https://colearn-tech.herokuapp.com/'
  ,
});

Vue.prototype.$http = http;

//User authentication state management
auth.onAuthStateChanged((user) => {
  if (user) {
    http
      .get("/user/get-user", { params: { email: user.email } })
      .then((res) => {
        store.dispatch("fetchUser", user);
        store.dispatch("fetchDetails", res.data);
        store.dispatch("giveAccess", true);
      });
  } else {
    store.dispatch("fetchUser", user);
  }
});

const socket = io(
  'https://colearn-tech.herokuapp.com/'
  // 'http://localhost:5000'
  , {
    autoConnect: false,
  }
)

Vue.use(VueSocketIOExt, socket);

//VueMq breakpoints, to programmatically adjust components according to screen sizes
Vue.use(VueMq, { breakpoints: { sm: 470, md: 1250, lg: Infinity } });

//Loading ellipses instantiation
Vue.use(VueEllipseProgress);

//Popever for hints and tutorials
Vue.use(Popover, { tooltip: true })

//To copy items to clipboard
Vue.use(Clipboard)

//Top progress bar
Vue.use(vueTopprogress)



new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
