<template>
  <section class="what-i-do">
    <v-row justify="center">
      <v-col cols="12" lg="8" md="8" sm="12">
        <h1 class="text-center section-title">What I Do</h1>
        <v-row justify="center">
          <v-col cols="12" md="4" sm="12" class="text-center mt-12">
            <v-card class="whatido-card" elevation="3">
              <v-img
                class="whatido-image"
                :src="require('../assets/full-stack-developer.png')"
                width="80"
              ></v-img>
            </v-card>

            <p class="whatido-title">Full Stack Developer</p>
            <p class="whatido-subtitle">Frontend and Backend</p>
          </v-col>
          <v-col cols="12" md="4" sm="12" class="text-center mt-12">
            <v-card class="whatido-card" elevation="3">
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
          <v-col cols="12" md="4" sm="12" class="text-center mt-12">
            <v-card class="whatido-card" elevation="3">
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
  </section>
</template>

<script>
export default {
  name: "WhatIDo",
};
</script>

<style lang="scss" scoped>
.whatido-image {
  margin: auto;
}
.section-title {
  margin-top: 6rem;
  margin-bottom: 1.5rem;
  color: #405680;
  font-size: 40px;
}
.whatido-title {
  margin-top: 1.5rem;
  color: #405680;
  font-weight: bold;
  font-size: 28px;
}
.whatido-subtitle {
  color: #707070;
  font-size: 20px;
}
.v-responsive.v-image.whatido-image {
  width: 60px !important;
}
.whatido-card {
  display: grid;
  margin: auto;
  width: 150px;
  height: 150px;
  border-radius: 15px !important;
}

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
  .section-title {
    font-size: 50px;
  }
  .whatido-title {
    font-size: 32px;
  }
  .whatido-subtitle {
    font-size: 25px;
  }
  .whatido-card {
    width: 165px;
    height: 165px;
  }
}

/* Extra large devices (large desktops, 1904px and up) */
@media (min-width: 1904px) {
  .section-title {
    font-size: 55px;
  }
  .whatido-card {
    width: 180px;
    height: 180px;
  }
}
</style>
