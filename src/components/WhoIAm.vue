<template>
  <section class="whoiam">
    <v-layout>
      <v-row justify="center">
        <v-col cols="8">
          <v-row>
            <v-col cols="4">
              <h1 class="section-title">Who I Am</h1>
            </v-col>
            <v-col cols="8">
              <p class="text-description">
                Hi, I’m Ekkchai. Nice to meet you. Since beginning my journey as
                a web developer nearly 4 years ago, I've done remote work for
                agencies, and collaborated with talented people to create
                digital products for both business and consumer use. I'm quietly
                confident, naturally curious, and perpetually improving my
                chops.
              </p>

              <div class="d-flex justify-start">
                <v-btn class="mr-10" rounded color="primary" x-large dark
                  >Download CV</v-btn
                >
                <a class="mr-2">
                  <v-img
                    class="whatido-image"
                    :src="require('../assets/github-logo.png')"
                    width="65"
                  ></v-img>
                </a>
                <a class="mr-2">
                  <v-img
                    class="whatido-image"
                    :src="require('../assets/linkedin-logo.png')"
                    width="65"
                  ></v-img>
                </a>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-layout>
  </section>
</template>

<script>
export default {
  name: "WhoIAm"
};
</script>

<style scoped>
.whoiam {
  margin-top: 6.5rem;
  background-color: #f7f7f7;
  padding: 2rem 0 2rem 0;
}
.section-title {
  color: #405680;
  font-size: 68px;
}
.text-description {
  font-size: 28px;
  color: #707070;
}
</style>
