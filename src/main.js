import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// import Vuetify from 'vuetify/lib'

import 'bootstrap/dist/css/bootstrap.css'
import 'vuetify/dist/vuetify.min.css'

Vue.config.productionTip = false

// Vue.use(Vuetify)

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App) // components: { App },
})
