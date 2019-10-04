import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home'
import Todolist from '../components/Todolist'
import Chatroom from '../components/Chatroom'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/Todolist',
      name: 'Todolist',
      component: Todolist
    },
    {
      path: '/Chatroom',
      name: 'Chatroom',
      component: Chatroom
    }
  ]
})