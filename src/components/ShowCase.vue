<template>
  <section class="show-case">
    <v-row justify="center">
      <v-col cols="8">
        <v-row>
          <v-col cols="6">
            <v-col cols="12">
              <v-card class="card-item" elevation="5">
                <div class="card-content">
                  <v-img class="card-image" :src="require('../assets/no-data.png')" width="250"></v-img>
                  <p>No data.</p>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12">
              <v-card class="card-item" elevation="5">
                <div class="card-content">
                  <v-img class="card-image" :src="require('../assets/no-data.png')" width="250"></v-img>
                  <p>No data.</p>
                </div>
              </v-card>
            </v-col>
            <v-col cols="12" class="text-right">
              <v-btn class="mr-10" elevation="5" rounded color="primary" x-large dark>
                <span class="ml-8 mr-8">View All</span>
              </v-btn>
            </v-col>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="12">
                <h1 class="section-title text-center">Show Case</h1>
              </v-col>
              <v-col cols="12">
                <v-card class="card-item" elevation="5">
                  <div class="card-content">
                    <v-img class="card-image" :src="require('../assets/no-data.png')" width="250"></v-img>
                    <p>No data.</p>
                  </div>
                </v-card>
              </v-col>
              <v-col cols="12">
                <v-card class="card-item" elevation="5">
                  <div class="card-content">
                    <v-img class="card-image" :src="require('../assets/no-data.png')" width="250"></v-img>
                    <p>No data.</p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </section>
</template>
<script>
export default {
  name: "ShowCase"
};
</script>
<style scoped>
@media screen and (min-width: 960px) {
  .show-case {
    margin-top: 2.5rem;
  }
  .section-title {
    color: #405680;
    font-size: 35px;
  }
  .card-item {
    display: grid;
    width: 100%;
    height: 25rem;
    margin: 1.5rem 0 1.5rem 0;
  }
  .card-content {
    text-align: center;
    margin: auto;
  }
  .card-content p {
    padding: 1rem;
    font-size: 10px;
    font-weight: bold;
    color: #cccfd6;
  }
  .v-responsive.v-image.card-image {
    width: 100px !important;
  }
}
@media screen and (min-width: 1264px) {
  .show-case {
    margin-top: 6.5rem;
  }
  .section-title {
    font-size: 48px;
  }
  .card-item {
    height: 35rem;
    margin: 1.5rem 0 1.5rem 0;
  }
  .card-content p {
    font-size: 15px;
  }
  .v-responsive.v-image.card-image {
    width: 150px !important;
  }
}
@media screen and (min-width: 1604px) {
  .show-case {
    margin-top: 6.5rem;
  }
  .section-title {
    font-size: 68px;
  }
  .card-item {
    height: 45rem;
    margin: 1.5rem 0 1.5rem 0;
  }
  .card-content p {
    padding: 1rem;
    font-size: 18px;
  }
  .v-responsive.v-image.card-image {
    width: 250px !important;
  }
}
</style>
