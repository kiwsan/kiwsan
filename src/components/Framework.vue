<template>
  <section class="framework">
    <p class="framework-title">THANKS</p>
    <div class="d-flex float-left">
      <v-img
        class="mr-2"
        :src="require('../assets/dribbble-logo.png')"
        width="50"
      ></v-img>
      <v-img
        class="mr-2"
        :src="require('../assets/shutterstock-logo.png')"
        width="50"
      ></v-img>
      <v-img
        class="mr-2"
        :src="require('../assets/adobe-xd-logo.png')"
        width="50"
      ></v-img>
    </div>
  </section>
</template>
<script>
export default {
  name: "Framework"
};
</script>
<style scoped>
.framework {
  margin-top: 5rem;
  padding-left: 2rem;
}
.framework-title {
  color: #405680;
  font-weight: bold;
}
</style>
