<template>
  <div class="home">
    <Header />
    <WhatIDo />
    <WhoIAm />
    <ShowCase />
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/components/Header";
import WhatIDo from "@/components/WhatIDo";
import WhoIAm from "@/components/WhoIAm";
import ShowCase from "@/components/ShowCase";

export default {
  name: "Home",
  components: {
    Header,
    WhatIDo,
    WhoIAm,
    ShowCase
  }
};
</script>
