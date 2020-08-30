import './registerServiceWorker'

import App from './App.vue'
import Component from 'vue-class-component'
import Vue from 'vue'
import VueMeta from 'vue-meta'
import createRouter from './router'
import createStore from './store'
import vuetify from './plugins/vuetify'

Vue.use(VueMeta, {
  keyName: 'head'
})

Component.registerHooks(['head'])

Vue.config.productionTip = false

export default () => {
  const store = createStore()
  const router = createRouter()
  return new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  })
}
