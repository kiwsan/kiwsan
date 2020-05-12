<template>
  <section class="framework">
    <p class="framework-title">THANKS</p>
    <div class="d-flex float-left">
      <v-img class="mr-2" :src="require('../assets/dribbble-logo.png')" width="50"></v-img>
      <v-img class="mr-2" :src="require('../assets/shutterstock-logo.png')" width="50"></v-img>
      <v-img class="mr-2" :src="require('../assets/adobe-xd-logo.png')" width="50"></v-img>
    </div>
  </section>
</template>
<script>
export default {
  name: "Framework"
};
</script>
<style scoped>
@media screen and (min-width: 960px) {
  .framework {
    margin-top: 5rem;
    padding-left: 2rem;
  }
  .framework-title {
    color: #405680;
    font-weight: bold;
    font-size: 15px;
  }
  .v-responsive.v-image.mr-2 {
    width: 35px !important;
  }
}
@media screen and (min-width: 1264px) {
  .framework-title {
    font-size: 20px;
  }
  .v-responsive.v-image.mr-2 {
    width: 45px !important;
  }
}
@media screen and (min-width: 1604px) {
  .framework {
    margin-top: 5rem;
    padding-left: 2rem;
  }
}
</style>
