<template>
  <!-- style="background-color: #e4e8ed;" -->
  <v-container fill-height fluid class="px-5">
    <v-row align="center" justify="center">
      <v-col cols="12">
        <!-- color="transparent" -->
        <v-card class="elevation-0" color="transparent" min-height="500">
          <v-card-text>
            <v-row>
              <v-col cols="12" class="text-center">
                <p class="font-weight-bold text-h1">
                  <span class="colorText">401</span>
                </p>
              </v-col>
              <v-col cols="12" class="text-center my-3">
                <p
                  class="colorText font-weight-bold text-h4"
                  style="font-size: 50px;"
                >
                  لاتملك صلاحية الدخول
                </p>
              </v-col>

              <v-col cols="12" class="text-center">
                <v-btn
                  dark
                  class="mb-10 "
                  @click="hasHistory() ? $router.go(-1) : $router.push('/')"
                  elevation="10"
                  color="#081D38"
                  >رجوع للصفحة السابقة</v-btn
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
export default {
  methods: {
    hasHistory() {
      return window.history.length > 2;
    },
  },
};
</script>

<style>
.colorText {
  color: c51162;
}
</style>
