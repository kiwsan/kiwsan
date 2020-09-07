<template>
  <section class="who-i-am">
    <v-row justify="center">
      <v-col cols="12" lg="8" md="8" sm="12">
        <v-row>
          <v-col cols="12" lg="4" md="4" sm="12">
            <h1 class="section-title">Who I Am</h1>
          </v-col>
          <v-col cols="12" lg="8" md="8" sm="12">
            <p class="text-description">
              Hi, I’m Ekkchai. Nice to meet you. Since beginning my journey as a
              web developer nearly 4 years ago, I've done remote work for
              agencies, and collaborated with talented people to create digital
              products for both business and consumer use. I'm quietly
              confident, naturally curious, and perpetually improving my chops.
            </p>

            <div class="d-flex justify-start">
              <v-btn
                elevation="5"
                class="mr-10"
                rounded
                color="primary"
                x-large
                dark
                >Download CV</v-btn
              >
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
  name: "WhoIAm",
};
</script>

<style lang="scss" scoped>
.who-i-am {
  margin-top: 2.5rem;
  background-color: #f7f7f7;
  padding: 1rem 2rem 1rem 2rem;
}
.section-title {
  color: #405680;
  font-size: 35px;
  text-align: center;
}
.text-description {
  font-size: 15px;
  color: #707070;
}
.v-responsive.v-image.who-i-am-image {
  height: 45px !important;
  width: 45px !important;
}
</style>
