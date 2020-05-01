<template>
  <div class="whatido">
    <v-row justify="center">
      <v-col cols="4" class="text-center">
        <v-card class="whatido-card">
          <v-img
            class="whatido-image"
            :src="require('../assets/full-stack-developer.png')"
            width="80"
          ></v-img>
        </v-card>

        <p class="whatido-title">Full Stack Developer</p>
        <p class="whatido-subtitle">Frontend and Backend</p>
      </v-col>
      <v-col cols="4" class="text-center">
        <div class="whatido-card">
          <v-img class="whatido-image" :src="require('../assets/devops.png')" width="80"></v-img>
        </div>

        <p class="whatido-title">DevOps</p>
        <p class="whatido-subtitle">Digitalocean, Docker, Jenkins and Travis</p>
      </v-col>
      <v-col cols="4" class="text-center">
        <div class="whatido-card">
          <v-img class="whatido-image" :src="require('../assets/uxui-design.png')" width="65"></v-img>
        </div>

        <p class="whatido-title">UX/UI Design</p>
        <p class="whatido-subtitle">Adobe XD</p>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "WhatIDo"
};
</script>

<style scoped>
.whatido-card {
  margin: auto;
  width: 150px;
  height: 150px;
  border-radius: 2em;
}
.whatido-title {
  color: #405680;
  font-size: 40px;
  font-weight: bold;
}
.whatido-image {
  margin: auto;
}
</style>
