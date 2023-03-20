<template>
  <v-row align="center" justify="center">
    <v-col dense cols="12" class="text-center justify-center d-flex">
      <v-icon color="#040849" size="120">{{iconData}}</v-icon>
    </v-col>
    <v-col dense cols="12" class="text-center justify-center d-flex">
      <p class="font-weight-bold text-color">{{ message }}</p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    message: String,
    iconProp: String,
  },

  computed: {
    iconData() {
      return this.iconProp ?? "mdi-grid-off";
    },
  },
};
</script>

<style></style>
