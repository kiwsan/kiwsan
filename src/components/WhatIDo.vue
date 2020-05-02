<template>
  <div class="whatido">
    <v-layout>
      <v-row justify="center">
        <v-col cols="8">
          <h1 class="text-center section-title">What I Do</h1>
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
              <v-card class="whatido-card">
                <v-img
                  class="whatido-image"
                  :src="require('../assets/devops.png')"
                  width="80"
                ></v-img>
              </v-card>

              <p class="whatido-title">DevOps</p>
              <p class="whatido-subtitle">
                Digitalocean, Docker, Jenkins and Travis
              </p>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-card class="whatido-card">
                <v-img
                  class="whatido-image"
                  :src="require('../assets/uxui-design.png')"
                  width="65"
                ></v-img>
              </v-card>

              <p class="whatido-title">UX/UI Design</p>
              <p class="whatido-subtitle">Adobe XD</p>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "WhatIDo"
};
</script>

<style scoped>
.section-title {
  margin-top: 6.5rem;
  margin-bottom: 4rem;
  color: #405680;
  font-size: 68px;
}
.whatido-card {
  display: grid;
  margin: auto;
  width: 150px;
  height: 150px;
  border-radius: 15px !important;
}
.whatido-title {
  margin-top: 2rem;
  color: #405680;
  font-size: 40px;
  font-weight: bold;
}
.whatido-image {
  margin: auto;
}
.whatido-subtitle {
  font-size: 28px;
  color: #707070;
}
</style>
