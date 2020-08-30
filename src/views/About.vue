<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
// @ is an alias to /src
import axios from "axios";
export default {
  name: "About",
  components: {},
  head() {
    return {
      title: this.foo.chartName,
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