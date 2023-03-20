<template>
  <v-dialog
    v-model="userLogoutDialog"
    min-height="200px"
    max-width="350px"
    persistent
  >
    <v-card>
      <v-card-text>
        <v-list-item two-line>
          <v-list-item-avatar>
            <v-icon size="30" class="mr-2" color="success">mdi-security</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title> Security </v-list-item-title>
            <v-list-item-subtitle>
              You have been logged out
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-card-text>

      <!-- <v-icon size="30" class="mr-2" color="primary">mdi-security</v-icon>
        <span class="headline">Security</span>
      
      <v-card-subtitle>
            <span class="headline">You have been logged out</span>
      </v-card-subtitle> -->

      <v-card-actions>
        <div style="width: 100%; text-align: center">
          <v-btn @click="activateSelcted" color="primary" outlined>
            <!-- <v-icon tyle="font-size: 19px; color:#fff">save</v-icon> -->
            <span>OK</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from "../eventBus.js";
export default {
  props: {
    userLogoutDialogProp: {},
  },
  name: "auth-User-Item",
  data: () => ({
    userLogoutDialog: false,
    confirmActivateTitle: "",
  }),
  watch: {
    userLogoutDialogProp: {
      handler(data) {
        this.userLogoutDialog = data;
      },
      immediate: true,
    },
  },
  methods: {
    activateSelcted() {
      this.userLogoutDialog = false;

      EventBus.$emit("closeUserLogoutDialog");

      this.$router.push("/login");

      //
    },
   

    closeActivateDialog() {
      this.activeItem = Object.assign({}, this.clearActivateItem);
      this.activateDialog = false;
      EventBus.$emit("closeActivateDialogCard");
    },
  },
};
</script>

<style>
</style>