import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Sql from '../views/Sql.vue'
import Authentication from '../views/Authentication.vue'
import Authenticate from '../components/authentication/Authenticate.vue'
import Register from '../components/authentication/Register.vue'

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [{
        path: '/', name: 'home', component: Home
    }, {
        path: '/authentication',
        component: Authentication,
        children:
            [{
                path: 'authenticate',
                name: 'authenticate',
                component: Authenticate,
            },
            {
                path: 'register',
                name: 'register',
                component: Register,
            },]
    },
    {
        path: '/learn-sql', name: 'sql-view', component: Sql,
    }
    ],
})