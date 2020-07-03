import Vue from "vue";
import App from "./App.vue";
import axios from "axios";
import VueMq from "vue-mq";
import VueEllipseProgress from "vue-ellipse-progress";
import * as firebase from "firebase";

//Navigation router
import router from "./router/router";

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
  baseURL: "http://localhost:5021/co-learn-a05d9/us-central1/app",
});

Vue.prototype.$http = http;

//Firebase config
var firebaseConfig = {
  apiKey: "AIzaSyCQ1ofiNqi57YO9TNi8zzljikkobALP1RE",
  authDomain: "co-learn-a05d9.firebaseapp.com",
  databaseURL: "https://co-learn-a05d9.firebaseio.com",
  projectId: "co-learn-a05d9",
  storageBucket: "co-learn-a05d9.appspot.com",
  messagingSenderId: "159948318731",
  appId: "1:159948318731:web:29bf2c7d4016fae29b3f0e",
  measurementId: "G-HWLQMHVY9K",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//User authentication state management
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
firebase.auth().onAuthStateChanged((user) => {
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

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
