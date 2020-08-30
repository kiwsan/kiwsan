<template>
  <div class="home">
    {{foo}}
    <HelloWorld></HelloWorld>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld,
  },
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
