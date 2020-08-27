import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";

import App from "./App.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vue from "vue";
import VueGtag from "vue-gtag";
import createRouter from "./router";
import createStore from "./store";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

Vue.use(VueGtag, {
  config: { id: "UA-150385748-1" }
});

library.add(faUserSecret);

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

export default () => {
  const store = createStore();
  const router = createRouter();
  return new Vue({
    router,
    store,
    render: (h) => h(App),
  });
};
