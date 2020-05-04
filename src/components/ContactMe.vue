<template>
  <section class="contact-me">
    <v-row justify="center">
      <v-col cols="5">
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
            <p class="contact-email">kiwsanthia@gmail.com</p>
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
.contact-me {
  margin-top: 25rem;
}
.contact-title {
  color: #707070;
}
.contact-email {
  color: #405680;
  font-size: 35px;
}
.menu-item {
  font-size: 20px;
  color: #405680;
}
.contact-menu {
  margin-top: 6rem;
}
.contact-area {
  position: relative;
}
.contact-bullet-left {
  position: absolute;
  left: -3rem;
  top: -3rem;
}
.contact-bullet-right {
  position: absolute;
  right: -3rem;
  bottom: -3rem;
}
</style>
