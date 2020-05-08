<template>
  <section class="web-developer">
    <v-row>
      <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12" class="pa-0">
        <v-img :src="require('../assets/iam-nothing-like-you.jpg')"></v-img>
      </v-col>
      <v-col cols="12" xl="6" lg="6" md="6" sm="12" xs="12" class="pa-0">
        <v-container class="whoami-panel">
          <div class="d-flex">
            <a class="menu-item font-weight-bold">STORY</a>
            <a class="menu-item font-weight-bold">NOTE</a>
            <a class="menu-item font-weight-bold">BLOG</a>

            <v-spacer></v-spacer>

            <a class="menu-item font-weight-bold">Hi there!</a>
          </div>

          <v-layout align-top class="text-content">
            <v-flex>
              <div class="mt-md-2">
                <p class="whoami-text">whoami:</p>
                <h1 class="whoami-title">I'm</h1>
                <h1 class="whoami-title">A Web</h1>
                <h1 class="whoami-title">Developer</h1>
              </div>

              <div class="mt-md-6">
                <v-btn elevation="5" rounded color="primary" x-large dark
                  >See Projects</v-btn
                >
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-col>
    </v-row>
    <v-content class="web-area">
      <div class="web-content">
        <v-row justify="center">
          <v-col cols="8">
            <v-card elevation="5">
              <v-row class="pa-md-2 pa-lg-4" justify="center">
                <v-col cols="1">
                  <v-img
                    :src="require('../assets/dotnet-full-logo.png')"
                  ></v-img>
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
      </div>
    </v-content>
  </section>
</template>

<script>
export default {
  name: "Header",
  data: () => ({
    //
  }),
  computed: {
    example() {
      switch (this.$vuetify.breakpoint.name) {
        case "xs":
          return "220px";
        case "sm":
          return "400px";
        case "md":
          return "500px";
        case "lg":
          return "600px";
        case "xl":
          return "800px";
      }

      return "100px";
    }
  }
};
</script>

<style scoped>
.web-area {
  position: relative;
  top: -80px;
}
.web-content {
  position: absolute;
  width: 100%;
}
.text-content {
  height: 95%;
}
.whoami-panel {
  height: 100%;
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

@media screen and (min-width: 960px) {
  .whoami-panel .whoami-title {
    font-size: 5rem;
  }
  .whoami-panel {
    padding: 1.5rem 4rem 0 2rem;
  }
  .menu-item {
    font-size: 18px;
    margin-right: 16px;
  }
  .whoami-panel .whoami-text {
    font-size: 12px;
  }
  .web-area {
    top: -55px;
  }
}
@media screen and (min-width: 1264px) {
  .whoami-panel .whoami-title {
    font-size: 6rem;
  }
  .whoami-panel .whoami-text {
    font-size: 16px;
  }
  .menu-item {
    font-size: 22px;
    margin-right: 16px;
  }
  .whoami-panel {
    padding: 2rem 4rem 0 2rem;
  }
  .web-area {
    top: -80px;
  }
}
@media screen and (min-width: 1604px) {
  .whoami-panel .whoami-title {
    font-size: 9rem;
  }
  .whoami-panel {
    padding: 3.5rem 4rem 0 4rem;
  }
  .text-content {
    height: 90%;
  }
}
</style>
