<template>
  <section class="why-hire-me">
    <v-row justify="center">
      <v-col cols="8">
        <h1 class="section-title text-center">Why Hire Me?</h1>
        <v-row>
          <v-col cols="6" class="whyme">
            <v-container bg fill-height grid-list-md text-xs-center>
              <v-layout row wrap align-center>
                <v-flex>
                  <v-img
                    :src="require('../assets/why-me.png')"
                    width="100%"
                  ></v-img>
                </v-flex>
              </v-layout>
            </v-container>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <v-alert
                  class="corporate-item"
                  border="left"
                  colored-border
                  color="red lighten-2"
                  elevation="5"
                >
                  <h1 class="corporate-title">Software Developer</h1>
                  <h1 class="corporate-title">At ADI (Thailand) Co., Ltd.</h1>
                  <p class="corporate-subtitle float-left">
                    Jul 2018 - Present
                  </p>
                  <div class="d-flex float-right">
                    <v-img
                      class="card-image"
                      :src="require('../assets/aig-logo.png')"
                      width="40"
                    ></v-img>
                  </div>
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-alert
                  class="corporate-item"
                  border="left"
                  colored-border
                  color="yellow lighten-1"
                  elevation="5"
                >
                  <h1 class="corporate-title">.NET Web Developer</h1>
                  <h1 class="corporate-title">At Ayodia Co., Ltd.</h1>
                  <p class="corporate-subtitle float-left">
                    Mar 2017 - Feb 2018
                  </p>
                  <div class="d-flex float-right">
                    <v-img
                      class="card-image"
                      :src="require('../assets/cpmaji-logo.png')"
                      width="40"
                    ></v-img>
                    <v-img
                      class="card-image"
                      :src="require('../assets/kasset-logo.png')"
                      width="40"
                    ></v-img>
                  </div>
                </v-alert>
              </v-col>
              <v-col cols="12">
                <v-alert
                  class="corporate-item"
                  border="left"
                  colored-border
                  color="light-blue lighten-2"
                  elevation="5"
                >
                  <h1 class="corporate-title">Junior .NET Developer</h1>
                  <h1 class="corporate-title">At PNL Co., Ltd.</h1>
                  <p class="corporate-subtitle float-left">
                    Nov 2015 - Feb 2017
                  </p>
                  <div class="d-flex float-right">
                    <v-img
                      class="card-image"
                      :src="require('../assets/bvl-logo.png')"
                      width="40"
                    ></v-img>
                    <v-img
                      class="card-image"
                      :src="require('../assets/pnl-logo.png')"
                      width="40"
                    ></v-img>
                  </div>
                </v-alert>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </section>
</template>
<script>
export default {
  name: "WhyHireMe"
};
</script>
<style scoped>
@media screen and (min-width: 960px) {
  .why-hire-me {
    margin-top: 2.5rem;
  }
  .section-title {
    color: #405680;
    font-size: 35px;
    margin-bottom: 1rem;
  }
  .corporate-item {
    padding-left: 2rem;
  }
  .corporate-title {
    color: #405680;
    font-size: 18px;
  }
  .corporate-subtitle {
    color: #707070;
    font-size: 10px;
    font-weight: bold;
  }
}
@media screen and (min-width: 1264px) {
  .why-hire-me {
    margin-top: 4rem;
  }
  .section-title {
    font-size: 35px;
    margin-bottom: 3rem;
  }
  .corporate-item {
    padding-left: 2rem;
  }
  .corporate-title {
    font-size: 30px;
  }
  .corporate-subtitle {
    font-size: 20px;
  }
}
@media screen and (min-width: 1604px) {
  .why-hire-me {
    margin-top: 6.5rem;
  }
  .section-title {
    font-size: 68px;
    margin-bottom: 4rem;
  }
  .corporate-item {
    padding-left: 2rem;
  }
  .corporate-title {
    font-size: 40px;
  }
  .corporate-subtitle {
    font-size: 20px;
  }
}
</style>
