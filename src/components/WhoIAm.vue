<template>
  <section class="who-i-am">
    <v-row justify="center">
      <v-col cols="8">
        <v-row>
          <v-col cols="4">
            <h1 class="section-title">Who I Am</h1>
          </v-col>
          <v-col cols="8">
            <p class="text-description">
              Hi, I’m Ekkchai. Nice to meet you. Since beginning my journey as a
              web developer nearly 4 years ago, I've done remote work for
              agencies, and collaborated with talented people to create digital
              products for both business and consumer use. I'm quietly
              confident, naturally curious, and perpetually improving my chops.
            </p>

            <div class="d-flex justify-start">
              <v-btn elevation="5" class="mr-10" rounded color="primary" x-large dark>Download CV</v-btn>
              <a class="mr-2">
                <v-img
                  class="who-i-am-image"
                  :src="require('../assets/github-logo.png')"
                  width="65"
                  elevation="5"
                ></v-img>
              </a>
              <a class="mr-2">
                <v-img
                  class="who-i-am-image"
                  :src="require('../assets/linkedin-brand-logo.png')"
                  width="65"
                  elevation="5"
                ></v-img>
              </a>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </section>
</template>

<script>
export default {
  name: "WhoIAm"
};
</script>

<style scoped>
@media screen and (min-width: 960px) {
  .who-i-am {
    margin-top: 2.5rem;
    background-color: #f7f7f7;
    padding: 1rem 0 1rem 0;
  }
  .section-title {
    color: #405680;
    font-size: 35px;
  }
  .text-description {
    font-size: 15px;
    color: #707070;
  }
  .v-responsive.v-image.who-i-am-image {
    height: 45px !important;
    width: 45px !important;
  }
}
@media screen and (min-width: 1264px) {
  .who-i-am {
    margin-top: 3.5rem;
    padding: 1.5rem 0 1.5rem 0;
  }
  .section-title {
    font-size: 48px;
  }
  .text-description {
    font-size: 20px;
  }
  .v-responsive.v-image.who-i-am-image {
    height: 55px !important;
    width: 55px !important;
  }
}
@media screen and (min-width: 1604px) {
  .who-i-am {
    margin-top: 6.5rem;
    padding: 3.5rem 0 3.5rem 0;
  }
  .section-title {
    font-size: 68px;
  }
  .text-description {
    font-size: 28px;
  }
  .v-responsive.v-image.who-i-am-image {
    height: 65px !important;
    width: 65px !important;
  }
}
</style>
