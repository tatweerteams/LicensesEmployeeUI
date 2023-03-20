<template>
  <!-- style="background-color: #e4e8ed;" -->
  <v-container  fluid class="px-5">
    <v-row >
      <v-col cols="12">
        <!-- color="transparent" -->
        <v-card class="elevation-0" color="transparent" min-height="400">
          <v-card-text>
            <v-row>
              <v-col cols="12" class="text-center">
                <v-img :src="imageWork" contain max-height="550"> </v-img>

                <v-btn
                  dark
                  class="mb-10 "
                  @click="exit"
                  elevation="10"
                  color="#081D38"
                  >تسجيل الخروج</v-btn
                >
              </v-col>
             
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import imageWork from "../../../assets/workTime.png";
export default {
  data() {
    return {
      imageWork: imageWork,
    };
  },
  methods: {
    exit() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style>
.colorText {
  color: c51162;
}
</style>
