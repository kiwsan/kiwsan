<template>
  <v-content class="home">
    <vue-headful
      title="I'm nothing like you."
      description="Hi, I’m Ekkchai. Nice to meet you. Since beginning my journey as a web developer nearly 4 years ago, I've done remote work for agencies, and collaborated with talented people to create digital products for both business and consumer use. I'm quietly confident, naturally curious, and perpetually improving my chops."
      keywords="Portfolio, Web Developer, Bangkok, Thailand"
      image="https://kiwsan.com/img/iam-nothing-like-you.264911da.jpg"
      url="https://kiwsan.com/"
    />
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
