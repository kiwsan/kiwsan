<template>
  <v-app>
    <v-main>
      <router-view v-if="!$errorHandler.error" />
      <ErrorPage v-else />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Component from "vue-class-component";
import ErrorPage from "@/components/ErrorPage.vue";

@Component({
  components: { ErrorPage },
})
export default class App extends Vue {
  head() {
    return {
      titleTemplate: (title: string) => {
        return title ? `${title} | kiwsan, inc.` : "kiwsan, inc.";
      },
      htmlAttrs: {
        lang: "en",
        amp: true,
      },
      bodyAttrs: {
        "data-spy": "scroll",
        "data-target": ".navbar-nav",
        "data-offset": "110",
      },
      //link: [{ rel: 'manifest', href: '/manifest.json' }],
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "kiwsan, inc. website!" },
        { name: "theme-color", content: "#ffffff" },
      ],
    };
  }
}
</script>
