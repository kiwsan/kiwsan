<template>
  <div class="header">
    <v-layout>
      <v-row>
        <v-col cols="5" class="pa-0">
          <v-img :src="require('../assets/iam-nothing-like-you.png')"></v-img>
        </v-col>
        <v-col cols="7" class="pa-0">
          <v-container class="whoami-panel">
            <div>
              <a class="menu-item font-weight-bold mr-10">STORY</a>
              <a class="menu-item font-weight-bold mr-10">NOTE</a>
              <a class="menu-item font-weight-bold mr-10">BLOG</a>

              <a class="menu-item font-weight-bold">Hi there!</a>
            </div>

            <div class="mt-10">
              <p class="whoami-text">whoami:</p>
              <h1 class="whoami-title">I'm</h1>
              <h1 class="whoami-title">A Web</h1>
              <h1 class="whoami-title">Developer</h1>
            </div>

            <div class="mt-10">
              <v-btn rounded color="primary" x-large dark>See Projects</v-btn>
            </div>
          </v-container>
        </v-col>
      </v-row>
    </v-layout>
    <v-layout>
      <v-row justify="center">
        <v-col cols="8">
          <v-card>
            <v-row class="pa-4" justify="center">
              <v-col cols="1">
                <v-img :src="require('../assets/dotnet-full-logo.png')"></v-img>
              </v-col>
              <v-col cols="1">
                <v-img
                  :src="require('../assets/angular-full-logo.png')"
                ></v-img>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
  </div>
</template>

<script>
export default {
  name: "Header",
  data: () => ({
    //
  })
};
</script>

<style scoped>
.whoami-panel {
  padding: 8rem 8rem 0 8rem;
}

.whoami-panel .whoami-text {
  color: #959595;
  font-size: 20px;
}

.whoami-panel .whoami-title {
  font-size: 9rem;
  color: #405680;
  line-height: 1.2;
}

.menu-item {
  font-size: 28px;
  color: #405680;
}
</style>
