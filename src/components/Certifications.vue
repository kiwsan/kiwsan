<template>
  <section class="certifications">
    <v-img
      class="cert-line"
      width="900"
      :src="require('../assets/studio.png')"
    ></v-img>
    <v-img
      class="cert-women"
      width="850"
      :src="require('../assets/goal.png')"
    ></v-img>
    <v-row justify="center" class="cert-content">
      <v-col cols="8">
        <v-row justify="end">
          <v-col cols="3"></v-col>
          <v-col cols="9">
            <v-card class="cert-card" elevation="5">
              <h1 class="cert-card-title">Certificartions</h1>
              <v-row>
                <v-col cols="4" class="text-center">
                  <v-img
                    class="mb-4"
                    :src="require('../assets/cert-ms-csharp.png')"
                  ></v-img>
                  <a class="cert-additional-link">Additional Details</a>
                </v-col>
                <v-col cols="8">
                  <h1 class="cert-title">Exam 483: Programming in c#</h1>
                  <h3 class="cert-subtitle">Issued by Microsoft</h3>
                  <p class="mt-6 cert-detail-text">
                    Passing Exam 483: Programming in c# validates a candidate's
                    ability to manage program flow, create and use types, debug
                    applications and implement security as well as implement
                    data access.
                  </p>
                  <h3 class="cert-subtitle skill mt-6">Skills</h3>
                  <v-row class="row-skil">
                    <v-col cols="5" class="pb-0">
                      <v-card class="text-center">
                        <p class="cert-detail-text pa-2">
                          Application Developer
                        </p>
                      </v-card>
                    </v-col>
                    <v-col cols="4" class="pb-0">
                      <v-card class="text-center">
                        <p class="cert-detail-text pa-2">C# Programming</p>
                      </v-card>
                    </v-col>
                    <v-col cols="3" class="pb-0">
                      <v-card class="text-center">
                        <p class="cert-detail-text pa-2">Linq</p>
                      </v-card>
                    </v-col>
                    <v-col cols="6" class="pb-0">
                      <v-card class="text-center">
                        <p class="cert-detail-text pa-2">
                          Object-based Programming
                        </p>
                      </v-card>
                    </v-col>
                    <v-col cols="5" class="pb-0">
                      <v-card class="text-center">
                        <p class="cert-detail-text pa-2">Web Developer</p>
                      </v-card>
                    </v-col>
                  </v-row>
                  <h3 class="cert-subtitle mt-4">Earning Criteria</h3>
                  <p class="cert-detail-text mt-4">
                    VALIDATE SKILLS IN THE FOLLWING AREAS:
                  </p>
                  <p class="cert-detail-text">- Manage program flow</p>
                  <p class="cert-detail-text">- Create and use types</p>
                  <p class="cert-detail-text">
                    - Debug applications and implement security
                  </p>
                  <p class="cert-detail-text">- Implement data access</p>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </section>
</template>
<script>
export default {
  name: "Certifications"
};
</script>
<style scoped>
@media screen and (min-width: 960px) {
  .certifications {
    margin-top: 6rem;
    position: relative;
    height: 19rem;
    width: 100%;
    background: #f9bc58;
  }
  .cert-content {
    width: 100%;
    position: absolute;
    top: -22%;
    border: 0px solid red;
  }
  .cert-line {
    position: absolute;
    bottom: 0;
    right: -5rem;
  }
  .cert-women {
    position: absolute;
    z-index: 100;
  }
  .cert-card {
    padding: 1rem 2.5rem 0 2.5rem;
  }
  .cert-card-title {
    color: #405680;
    font-size: 35px;
  }
  .cert-additional-link {
    color: #405680;
    font-size: 12px;
  }
  .cert-title {
    color: #405680;
    font-size: 18px;
  }
  .cert-subtitle {
    color: #707070;
    font-size: 10px;
  }
  .cert-detail-text {
    color: #707070;
    font-size: 10px;
  }
  .v-responsive.v-image.cert-women {
    width: 450px !important;
  }
  .v-responsive.v-image.cert-line {
    width: 500px !important;
  }
  .skill {
    display: none;
  }
  .row-skil {
    display: none;
  }
}
@media screen and (min-width: 1264px) {
  .certifications {
    margin-top: 11rem;
    height: 25rem;
    width: 100%;
  }
  .cert-content {
    top: -22%;
  }
  .cert-line {
    bottom: 0;
    right: -5rem;
  }
  .cert-card {
    padding: 1rem 2.5rem 0 2.5rem;
  }
  .cert-card-title {
    font-size: 35px;
  }
  .cert-additional-link {
    font-size: 20px;
  }
  .cert-title {
    font-size: 25px;
  }
  .cert-subtitle {
    font-size: 18px;
  }
  .cert-detail-text {
    font-size: 15px;
  }
  .v-responsive.v-image.cert-women {
    width: 600px !important;
  }
}
@media screen and (min-width: 1604px) {
  .certifications {
    margin-top: 15rem;
    height: 35rem;
    width: 100%;
  }
  .cert-content {
    top: -22%;
  }
  .cert-line {
    bottom: 0;
    right: -5rem;
  }
  .cert-card {
    padding: 1rem 2.5rem 0 2.5rem;
  }
  .cert-card-title {
    font-size: 68px;
  }
  .cert-additional-link {
    font-size: 18px;
  }
  .cert-title {
    font-size: 30px;
  }
  .v-responsive.v-image.cert-women {
    width: 850px !important;
  }
  .v-responsive.v-image.cert-line {
    width: 900px !important;
  }
  .skill {
    display: flex;
  }
  .row-skil {
    display: flex;
  }
}
</style>
