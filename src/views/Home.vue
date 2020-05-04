<template>
  <v-content class="home">
    <WebDeveloper />
    <WhatIDo />
    <WhoIAm />
    <ShowCase />
    <WhyHireMe />
    <Certifications />
    <ContactMe />
    <Framework />
    <Footer />
  </v-content>
</template>

<script>
// @ is an alias to /src
import WebDeveloper from "@/components/WebDeveloper";
import WhatIDo from "@/components/WhatIDo";
import WhoIAm from "@/components/WhoIAm";
import ShowCase from "@/components/ShowCase";
import WhyHireMe from "@/components/WhyHireMe";
import Certifications from "@/components/Certifications";
import ContactMe from "@/components/ContactMe";
import Framework from "@/components/Framework";
import Footer from "@/components/Footer";

export default {
  name: "Home",
  components: {
    WebDeveloper,
    WhatIDo,
    WhoIAm,
    ShowCase,
    WhyHireMe,
    Certifications,
    ContactMe,
    Framework,
    Footer
  }
};
</script>
