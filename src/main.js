import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import VueMq from "vue-mq";
import VueEllipseProgress from "vue-ellipse-progress";
import Popover from 'vue-js-popover'
import Clipboard from 'v-clipboard'
import vueTopprogress from 'vue-top-progress'
import Notifications from 'vue-notification'
import { vsList, vsIcon } from "vuesax";
import Vue2TouchEvents from 'vue2-touch-events'
import VueTimeago from 'vue-timeago'
import { Drawer } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import VueScrollTo from "vue-scroll-to"



// import "vuesax/dist/vuesax.css";



import { auth } from "./firebase";
//Navigation router
import { router } from "./router/router";

//State management
import store from "./store/store";

Vue.config.productionTip = false;

//Establish to communciate between components
export const bus = new Vue();

/**
 * This axios instantiation is for dev-build testing only. Comment out before production
 */
const http = axios.create({
  baseURL:
    "http://localhost:5000/"
  // 'https://back.colearn.tech'
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

Vue.use(Notifications)

Vue.use(vsList)
Vue.use(vsIcon)
Vue.use(Vue2TouchEvents)
Vue.use(VueTimeago, { locale: 'en' })
Vue.component(Drawer.name, Drawer)
Vue.use(VueScrollTo);

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
