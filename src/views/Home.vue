<template>
  <div class="home">
    <Header />
    <v-layout>
      <v-row justify="center">
        <v-col cols="8">
          <h1 class="text-center section-title">What I Do</h1>
          <WhatIDo class />
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header";
import WhatIDo from "@/components/WhatIDo";

export default {
  name: "Home",
  components: {
    Header,
    WhatIDo
  }
};
</script>

<style scoped>
.separate-section {
  margin-top: 2rem;
}

.section-title {
  margin-top: 7rem;
  margin-bottom: 4rem;
  color: #405680;
  font-size: 68px;
}
</style>
