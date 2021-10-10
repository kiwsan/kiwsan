<template>
  <section class="contact-me">
    <v-row justify="center">
      <v-col cols="12" lg="5" md="6">
        <div class="contact-area">
          <div class="contact-bullet-left">
            <v-img
              width="100"
              :src="require('../assets/bullter-left.png')"
            ></v-img>
          </div>
          <div class="contact-bullet-right">
            <v-img
              width="100"
              :src="require('../assets/bullter-right.png')"
            ></v-img>
          </div>
          <v-alert
            border="bottom"
            colored-border
            color="yellow lighten-1"
            elevation="5"
            class="contact-content text-center pt-10"
          >
            <p class="contact-title">Contact Me</p>
            <p class="contact-email">@kiwsan</p>
          </v-alert>
        </div>

        <div class="contact-menu text-center">
          <a class="menu-item font-weight-bold mr-10">STORY</a>
          <a class="menu-item font-weight-bold mr-10">NOTE</a>
          <a class="menu-item font-weight-bold mr-10">BLOG</a>
        </div>
      </v-col>
    </v-row>
  </section>
</template>
<script>
export default {
  name: "ContactMe"
};
</script>
<style scoped>
@media screen and (min-width: 960px) {
  .contact-me {
    margin-top: 16rem;
  }
  .contact-title {
    color: #707070;
    font-size: 12px;
  }
  .contact-email {
    color: #405680;
    font-size: 20px;
  }
  .menu-item {
    font-size: 15px;
    color: #405680;
  }
  .contact-menu {
    margin-top: 4rem;
  }
  .contact-area {
    position: relative;
  }
  .contact-bullet-left {
    position: absolute;
    left: -2rem;
    top: -2rem;
  }
  .contact-bullet-right {
    position: absolute;
    right: -2rem;
    bottom: -2rem;
  }
  .v-responsive.v-image {
    width: 70px !important;
  }
}
@media screen and (min-width: 1264px) {
  .contact-me {
    margin-top: 20rem;
  }
  .contact-email {
    font-size: 28px;
  }
  .menu-item {
    font-size: 20px;
  }
  .contact-menu {
    margin-top: 5rem;
  }
  .contact-title {
    font-size: 18px;
  }
}
@media screen and (min-width: 1604px) {
  .contact-me {
    margin-top: 25rem;
  }
  .contact-email {
    font-size: 35px;
  }
  .menu-item {
    font-size: 20px;
  }
  .contact-menu {
    margin-top: 6rem;
  }
  .contact-bullet-left {
    left: -3rem;
    top: -3rem;
  }
  .contact-bullet-right {
    right: -3rem;
    bottom: -3rem;
  }
  .v-responsive.v-image {
    width: 100px !important;
  }
}
</style>
