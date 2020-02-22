import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Nav from '../views/Nav.vue'

Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    component: Nav,
    children: [
      {
        path: '/',
        redirect: 'Home',
        linkActiveClass: ' open active'
      },
      {
        path: 'home',
        component: () => import('../views/Home.vue'),
        children: []
      },
      {
        path: 'text',
        component: () => import('../views/text.vue')
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
