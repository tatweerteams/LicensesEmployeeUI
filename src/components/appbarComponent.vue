<template>
  <v-app-bar
    color="#6A76AB"
    dark
    elevation="0"
    height="180"
    extended
    hide-on-scroll
    prominent
    fade-img-on-scroll
    :src="appBarJamhoria"
  >
    <template v-slot:img="{ props }">
      <v-img
        v-bind="props"
        gradient="to top right, rgba(100,115,201,.7), rgba(25,32,72,.7)"
      ></v-img>
    </template>
    <v-spacer></v-spacer>
    <v-icon
      style="
        color: #ffffff !important;
        caret-color: #ffffff !important;
        opacity: 1;
      "
      @click="logout"
      icon
      class="mt-5"
    >
      mdi-exit-to-app
    </v-icon>
  </v-app-bar>
</template>

<script>
import appBarJamhoria from "../assets/55445.jpg";
export default {
  data: () => ({
    appBarJamhoria: appBarJamhoria,
  }),

  methods: {
    logout() {
      this.$store.dispatch("auth/logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style>
</style>