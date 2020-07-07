import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store/store"
import Home from "../views/Home.vue"
import Sql from "../views/Sql.vue"
// const Home = () => import(/* webpackChunkName: "home" */ "../views/Home.vue");
const Authentication = () =>
  import(
    /* webpackChunkName: "authentication" */ "../views/Authentication.vue"
  );
const Authenticate = () =>
  import(
    /* webpackChunkName: "authentication" */ "../components/authentication/Authenticate.vue"
  );
const Register = () =>
  import(
    /* webpackChunkName: "authentication" */ "../components/authentication/Register.vue"
  );
const Beta = () => import(/* webpackChunkName: "beta" */ "../views/Beta.vue");

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '*',
      component: Home,
    },
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        title: 'Colearn - Learn together!',
        metaTags: [
          {
            name: 'description',
            content: 'An online collaborative learning tool for in-demand programming languages'
          },
          {
            property: 'og:description',
            content: 'An online collaborative learning tool for in-demang programming languages'
          }
        ]
      },
      props() {
        if (store.getters.user.authenticated) {
          if (!store.getters.user.data.verified) {

            return { verified: false }
          } else {
            return { verified: true }
          }
        }
      }
    },
    {
      path: "/authentication",
      component: Authentication,
      beforeEnter: (to, from, next) => {
        if (!store.getters.user.authenticated) {
          next();
          return
        } else {
          next({ name: 'home' })
        }
      },
      children: [
        {
          path: "authenticate",
          name: "authenticate",
          component: Authenticate,
          meta: {
            title: 'Colearn - Authenticate',
            metaTags: [
              {
                name: 'description',
                content: 'Log in to your colearn account'
              },
              {
                property: 'og:description',
                content: 'Log in to your colearn account'
              }
            ]
          }
        },
        {
          path: "register",
          name: "register",
          component: Register,
          meta: {
            title: 'Colearn - Register',
            metaTags: [
              {
                name: 'description',
                content: 'Create a new colearn account'
              },
              {
                property: 'og:description',
                content: 'Create a new colearn account'
              }
            ]
          }
        },
      ],
    },
    {
      path: "/learn-sql/:sessionId",
      name: "learn-sql",
      component: Sql,
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
      meta: {
        metaTags: [
          {
            name: 'description',
            content: 'Join a SQL session'
          },
          {
            property: 'og:description',
            content: 'Join a SQL session'
          }
        ]
      }
    },
    {
      path: "/verified/__/auth/action/",
      name: "verified",
      component: () => import(/* webpackChunkName: "verified" */ "../views/Verified.vue"),
      meta: {
        title: 'Colearn - Verified',
        metaTags: [
          {
            name: 'description',
            content: 'Your account has been verified'
          },
          {
            property: 'og:description',
            content: 'Your account has been verified'
          }
        ]
      }
    },
    {
      path: "/sessions/",
      name: "sessions",
      component: () => import(/* webpackChunkName: "verified" */ "../views/Sessions.vue"),
      meta: {
        title: 'Colearn - Sessions',
        metaTags: [
          {
            name: 'description',
            content: 'Create, join or manage your sessions'
          },
          {
            property: 'og:description',
            content: 'Create, join or manage your sessions'
          }
        ]
      },
      beforeEnter: (to, from, next) => {
        if (store.getters.user.authenticated) {
          next();
        } else {
          next({ name: 'home' })
        }
      }
    },
    {
      path: "/account",
      name: "account",
      component: () => import(/* webpackChunkName: "verified" */ "../views/Account.vue"),
      meta: {
        title: 'Colearn - Account Portal',
        metaTags: [
          {
            name: 'description',
            content: 'Manage your colearn account'
          },
          {
            property: 'og:description',
            content: 'Manage your colearn account'
          }
        ]
      },
      beforeEnter: (to, from, next) => {
        if (store.getters.user.authenticated) {
          next();
        } else {
          next({ name: 'home' })
        }
      }
    },
  ],
});