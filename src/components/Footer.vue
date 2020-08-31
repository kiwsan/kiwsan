<template>
  <section class="footer">
    <p class="footer-text">
      &copy; kiwsan 2020. All rights reserved. (beta version 1.0.23)
    </p>
  </section>
</template>
<script>
export default {
  name: "Footer"
};
</script>
<style scoped>
@media screen and (min-width: 960px) {
  .footer {
    margin-top: 5rem;
    width: 100%;
    height: 25px;
    background-color: #2a66d4;
    text-align: center;
    padding: 1.2rem 0 2.5rem 0;
  }
  .footer-text {
    color: white;
    font-size: 15px;
  }
}
@media screen and (min-width: 1264px) {
}
@media screen and (min-width: 1604px) {
  .footer {
    margin-top: 5rem;
    height: 25px;
    padding: 2rem 0 3rem 0;
  }
  .footer-text {
    font-size: 18px;
  }
}
</style>
