import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Sql from '../views/Sql.vue'

Vue.use(VueRouter)

export default new VueRouter({
    routes: [{
        path: '/', name: 'home', component: Home
    },
    {
        path: '/learn-sql', name: 'sql-view', component: Sql,
    }
    ],
})