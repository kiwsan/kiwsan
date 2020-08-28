import './registerServiceWorker'

import App from './App.vue'
import Vue from 'vue'
import VueGtag from 'vue-gtag'
import VueMeta from 'vue-meta'
import createRouter from './router'
import createStore from './store'
import vuetify from './plugins/vuetify'

/**
 * Vue meta plugin installation
 */
Vue.use(VueMeta, {
  keyName: 'head',
})

Vue.use(VueGtag, {
  config: {
    id: "UA-150385748-1"
  }
})

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