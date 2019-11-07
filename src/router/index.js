import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/Home'
import Todolist from '../components/Todolist'
import Chatroom from '../components/Chatroom'
import Scroller from '../components/Scroller'
import Testing_60s from '../components/Testing_60s'

Vue.use(Router)

export default new Router({
  // mode: 'history', // 造成白屏 https://blog.csdn.net/tom_wong666/article/details/82670582
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
    },
    {
      path: '/Scroller',
      name: 'Scroller',
      component: Scroller
    },
    {
      path: '/Testing_60s',
      name: 'Testing_60s',
      component: Testing_60s
    }
    
  ]
})