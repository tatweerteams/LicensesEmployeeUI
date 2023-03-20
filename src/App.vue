<template>
  <v-app class="">
    <!-- <user-Logout-Dialog :userLogoutDialogProp="userLogoutDialog">
    </user-Logout-Dialog> -->
    <!-- <v-idle v-if="currentRouteName"  :duration="300" :loop="true" @idle="onidle" /> -->
    <v-overlay
      class="text-center justify-center"
      color="#261f46"
      opacity="0.9"
      z-index="1000"
      v-if="$store.state.setloading"
    >
      <v-row align="center" justify="center">
        <v-flex xs6 class="hidden-sm-and-down">
          <v-col class="justify-center">
            <!-- <v-img max-width="200" :src="logoJamhoria"> </v-img> -->
          </v-col>
        </v-flex>

        <v-col cols="12" md="12">
          <v-progress-circular
            color="#FFFFFF"
            indeterminate
            size="30"
            class="ml-5"
          ></v-progress-circular>

          الرجاء الإنتظار....
        </v-col>
      </v-row>
    </v-overlay>
    <notification></notification>

    <router-view></router-view>
  </v-app>
</template>

<script>
import notification from "./components/notification";
// import background from "./assets/backgroundWebSit.svg";

import { EventBus } from "../src/eventBus.js";
export default {
  name: "App",

  components: {
    notification,
    // "user-Logout-Dialog": userLogout,
  },
  created() {
    EventBus.$on("closeUserLogoutDialog", () => {
      this.userLogoutDialog = false;
    });
  },
  computed: {
    currentRouteName() {
      return this.$route.name != "login";
    },
  },

  data: () => ({
    userLogoutDialog: false,
   
    // cover: "cover",
    // background: background,
  }),

  methods: {
    onidle() {
      this.logout();
      this.userLogoutDialog = true;
    },

    logout() {
      this.$store.dispatch("auth/logout");
    },
  },
};
</script>
<style>
::-webkit-scrollbar {
  width: 0px;
  background: transparent; /* make scrollbar transparent */
}

.back {
  background: #005aa7 !important;
  background: -webkit-linear-gradient(to right, #fffde4, #005aa7) !important;
  background: linear-gradient(to right, #fffde4, #005aa7) !important;
}
</style>
