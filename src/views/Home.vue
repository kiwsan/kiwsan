<template>
  <div class="home">
    <div>Data from asyncData: {{ foo }}</div>

    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import axios from "axios";
export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  
  data() {
    return {
      foo: {},
    };
  },

  head() {
    return {
      title: this.foo.disclaimer,
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
