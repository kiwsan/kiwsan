<template>
  <v-layout>
    <v-flex md6>
      <v-img :src="require('../assets/iam-nothing-like-you.png')"></v-img>
    </v-flex>
    <v-flex md6 class="whoami-panel">
      <div class="d-flex mb-2" color="lighten-2" flat tile>
        <a outlined tile class="menu-item font-weight-bold mr-10">STORY</a>
        <a outlined tile class="menu-item font-weight-bold mr-10">NOTE</a>
        <a outlined tile class="menu-item font-weight-bold mr-10">BLOG</a>
        <a outlined tile class="menu-item font-weight-bold ml-auto">Hi there!</a>
      </div>
      <p class="whoami-text">whoami:</p>
      <h1 class="whoami-title">I'm</h1>
      <h1 class="whoami-title">A Web</h1>
      <h1 class="whoami-title">Developer</h1>
      <v-btn rounded color="primary" x-large dark>See Projects</v-btn>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  name: "Header",
  data: () => ({
    //
  })
};
</script>

<style scoped>
.whoami-panel {
  padding: 8rem;
}

.whoami-panel .whoami-text {
  color: #959595;
  font-size: 20px;
}

.whoami-panel .whoami-title {
  font-size: 9rem;
  color: #405680;
}

.menu-item {
  font-size: 28px;
  color: #405680;
}
</style>
