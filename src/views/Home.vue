<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
    <b-col lg="4" class="pb-2">
      <b-button size="sm">
        Small Button
        <font-awesome-icon :icon="['fas', 'user-secret']" />
      </b-button>
    </b-col>
    {{posts}}
  </div>
</template>

<script>
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src
import axios from "axios";
export default {
  name: "Home",
  components: {
    HelloWorld,
  },
  async asyncData() {
    const response = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/1`
    );
    return { posts: response.data };
  },
};
</script>
