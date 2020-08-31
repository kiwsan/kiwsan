<template>
  <div class="home">
    <WebDeveloper />
    <WhatIDo />
    <WhoIAm />
    <ShowCase />
    <WhyHireMe />
    <Certifications />
    <ContactMe />
    <Framework />
    <Footer />
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "axios";
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
    Footer,
  },
  head() {
    return {
      title: this.foo.disclaimer,
      meta: [],
    };
  },

  data() {
    return {
      foo: {
        disclaimer: "Home",
      },
    };
  },

  async asyncData() {
    const response = await axios.get(
      "https://api.coindesk.com/v1/bpi/currentprice.json"
    );
    // Of course you can populate your Vuex store
    // store.commit("SET_DATA", data.vuex);
    // And send data to current component
    return {
      foo: response.data,
    };
  },
};
</script>
