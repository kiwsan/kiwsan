import App from "./App.vue";
import Vue from "vue";
import router from "./router";
import vueHeadful from "vue-headful";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;
Vue.component("vue-headful", vueHeadful);

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount("#app");
