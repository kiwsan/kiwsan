<template>
  <v-content class="home">
    <WebDeveloper />
    <WhatIDo />
    <WhoIAm />
    <ShowCase />
    <WhyHireMe />
  </v-content>
</template>

<script>
// @ is an alias to /src
import WebDeveloper from "@/components/WebDeveloper";
import WhatIDo from "@/components/WhatIDo";
import WhoIAm from "@/components/WhoIAm";
import ShowCase from "@/components/ShowCase";
import WhyHireMe from "@/components/WhyHireMe";

export default {
  name: "Home",
  components: {
    WebDeveloper,
    WhatIDo,
    WhoIAm,
    ShowCase,
    WhyHireMe
  }
};
</script>
