<template>
  <section class="what-i-do">
    <v-row justify="center">
      <v-col cols="8">
        <h1 class="text-center section-title">What I Do</h1>
        <v-row justify="center">
          <v-col cols="12" md="4" sm="12" class="text-center">
            <v-card class="whatido-card" elevation="5">
              <v-img
                class="whatido-image"
                :src="require('../assets/full-stack-developer.png')"
                width="80"
              ></v-img>
            </v-card>

            <p class="whatido-title">Full Stack Developer</p>
            <p class="whatido-subtitle">Frontend and Backend</p>
          </v-col>
          <v-col cols="12" md="4" sm="12" class="text-center">
            <v-card class="whatido-card" elevation="5">
              <v-img class="whatido-image" :src="require('../assets/devops.png')" width="80"></v-img>
            </v-card>

            <p class="whatido-title">DevOps</p>
            <p class="whatido-subtitle">Digitalocean, Docker, Jenkins and Travis</p>
          </v-col>
          <v-col cols="12" md="4" sm="12" class="text-center">
            <v-card class="whatido-card" elevation="5">
              <v-img class="whatido-image" :src="require('../assets/uxui-design.png')" width="65"></v-img>
            </v-card>

            <p class="whatido-title">UX/UI Design</p>
            <p class="whatido-subtitle">Adobe XD</p>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </section>
</template>

<script>
export default {
  name: "WhatIDo"
};
</script>

<style scoped>
.whatido-image {
  margin: auto;
}

@media screen and (min-width: 960px) {
  .section-title {
    margin-top: 6rem;
    margin-bottom: 1.5rem;
    color: #405680;
    font-size: 35px;
  }
  .whatido-title {
    margin-top: 1.5rem;
    color: #405680;
    font-size: 20px;
    font-weight: bold;
  }
  .whatido-subtitle {
    font-size: 15px;
    color: #707070;
  }
  .v-responsive.v-image.whatido-image {
    width: 40px !important;
  }
  .whatido-card {
    display: grid;
    margin: auto;
    width: 100px;
    height: 100px;
    border-radius: 15px !important;
  }
}
@media screen and (min-width: 1264px) {
  .whatido-card {
    width: 130px;
    height: 130px;
  }
  .v-responsive.v-image.whatido-image {
    width: 50px !important;
  }
  .section-title {
    margin-top: 7rem;
    margin-bottom: 2rem;
    font-size: 48px;
  }
  .whatido-title {
    font-size: 30px;
  }
  .whatido-subtitle {
    font-size: 20px;
  }
}
@media screen and (min-width: 1604px) {
  .section-title {
    margin-top: 12rem;
    margin-bottom: 4rem;
    font-size: 68px;
  }
  .whatido-title {
    margin-top: 2rem;
    font-size: 40px;
  }
  .whatido-subtitle {
    font-size: 28px;
  }
  .whatido-card {
    width: 150px;
    height: 150px;
  }
}
</style>
