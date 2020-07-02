import Vue from "vue";
import VueRouter from "vue-router";
// import Home from "../views/Home.vue";
const Home = () => import(/* webpackChunkName: "home" */ "../views/Home.vue");
// import Sql from "../views/Sql.vue";
// import Authentication from "../views/Authentication.vue";
const Authentication = () =>
  import(
    /* webpackChunkName: "authentication" */ "../views/Authentication.vue"
  );
// import Authenticate from "../components/authentication/Authenticate.vue";
const Authenticate = () =>
  import(
    /* webpackChunkName: "authentication" */ "../components/authentication/Authenticate.vue"
  );
// import Register from "../components/authentication/Register.vue";
const Register = () =>
  import(
    /* webpackChunkName: "authentication" */ "../components/authentication/Register.vue"
  );
// import Beta from "../views/Beta.vue";
const Beta = () => import(/* webpackChunkName: "beta" */ "../views/Beta.vue");

Vue.use(VueRouter);

export default new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      component: () => import(/* webpackChunkName: "NotFound" */"../views/NotFound.vue")
    },
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/authentication",
      component: Authentication,
      children: [
        {
          path: "authenticate",
          name: "authenticate",
          component: Authenticate,
        },
        {
          path: "register",
          name: "register",
          component: Register,
        },
      ],
    },
    {
      path: "/learn-sql/:sessionId",
      name: "learn-sql",
      component: () => import(/* webpackChunkName: "sql" */ "../views/Sql.vue"),
    },
    {
      path: "/beta",
      name: "beta",
      component: Beta,
    },
    {
      path: "/join/:sessionId",
      name: 'join-sql',
      component: () => import(/* webpackChunkName: "joinSql" */"../components/authentication/Session.vue"),
    },

  ],
});
