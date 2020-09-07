<template>
  <div class="web-developer">
    <v-row no-gutters>
      <v-col md="6" class="pa-0 hidden-xs-only">
        <img src="@/assets/iam-nothing-like-you.jpg" class="w-100" />
      </v-col>
      <v-col md="6" class="pa-md-5 pa-xs-0">
        <v-app-bar color="white" flat>
          <v-tabs
            optional
            slider-color="white"
            class="hidden-xs-only md_tabs"
            left
            background-color="white"
          >
            <v-tab class="black--text" router :to="'/'">NOTE</v-tab>
            <v-tab class="black--text" router :to="'/'">BLOG</v-tab>
            <v-tab class="black--text" router :to="'/'">STORY</v-tab>
          </v-tabs>

          <v-spacer></v-spacer>

          <v-toolbar-title>kiwsan, inc.</v-toolbar-title>
        </v-app-bar>
        <v-layout align-top class="md_layout">
          <v-flex>
            <div class="mt-md-2 md_title">
              <p>whoami:</p>
              <h1 :style="titleSize">I'm</h1>
              <h1 :style="titleSize">Web</h1>
              <h1 :style="titleSize">Developer</h1>
            </div>

            <div class="mt-4">
              <v-btn elevation="5" rounded color="primary" x-large>
                See Projects
              </v-btn>
            </div>
          </v-flex>
        </v-layout>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: "WebDeveloper",
  computed: {
    titleSize() {
      switch (this.$vuetify.breakpoint.name) {
        default:
          return "font-size: 150px";
        case "xs":
          return "font-size: 65px";
        case "sm":
          return "font-size: 50px";
        case "md":
          return "font-size: 85px";
        case "lg":
          return "font-size: 120px";
        case "xl":
          return "font-size: 150px";
      }
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.md_tabs {
  width: unset;
}
.md_layout {
  padding-left: 1.5rem;
}
.md_title h1 {
  line-height: 1.2;
  color: #405680;
}
.md_title p {
  font-size: 16px;
}
</style>
