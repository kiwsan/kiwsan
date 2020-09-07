<template>
  <div class="home">
    <WebDeveloper />
    <WhatIDo />
    <WhoIAm />
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import WebDeveloper from "@/components/WebDeveloper.vue";
import WhatIDo from "@/components/WhatIDo.vue";
import WhoIAm from "@/components/WhoIAm.vue";
export default {
  name: "Home",
  components: { WebDeveloper, WhatIDo, WhoIAm },
  head() {
    return {
      title: this.foo.disclaimer,
      meta: [],
    };
  },

  data() {
    return {
      foo: {
        disclaimer: "Home",
      },
    };
  },

  async asyncData() {
    const response = await axios.get(
      "https://api.coindesk.com/v1/bpi/currentprice.json"
    );
    // Of course you can populate your Vuex store
    // store.commit("SET_DATA", data.vuex);
    // And send data to current component
    return {
      foo: response.data,
    };
  },
};
</script>
<style lang="scss" scoped>
/* 
Extra small devices (portrait phones, less than 600px) 
No media query since this is the default in Vuetifyjs because it is "mobile first"
*/

/* Small devices (landscape phones, 600px and up) */
@media (min-width: 600px) {
}

/* Medium devices (tablets, 960px and up) The navbar toggle appears at this breakpoint */
@media (min-width: 960px) {
}

/* Large devices (desktops, 1264px and up) */
@media (min-width: 1264px) {
}

/* Extra large devices (large desktops, 1904px and up) */
@media (min-width: 1904px) {
}
</style>
