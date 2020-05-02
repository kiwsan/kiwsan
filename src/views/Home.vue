<template>
  <div class="home">
    <Header />
    <WhatIDo />
    <WhoIAm />
    <ShowCase />
    <WhyHireMe />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header";
import WhatIDo from "@/components/WhatIDo";
import WhoIAm from "@/components/WhoIAm";
import ShowCase from "@/components/ShowCase";
import WhyHireMe from "@/components/WhyHireMe";

export default {
  name: "Home",
  components: {
    Header,
    WhatIDo,
    WhoIAm,
    ShowCase,
    WhyHireMe
  }
};
</script>
