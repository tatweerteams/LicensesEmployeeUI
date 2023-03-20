<template>
  <v-snackbar
    v-model="show"
    :color="colorDef"
    :top="true"
    :timeout="2000"
    :right="true"
    elevation="10"
    class="text-center justify-center mt-10"
    max-height="100"
    min-height="100"
    shaped
    content-class="text-center justify-center"
    transition="fab-transition"
  >
    {{ message }}
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      message: "",
      color: "",
      colorDef: "#261f46",
    };
  },

  created() {
    this.$store.subscribe((mutation, state) => {
      if (mutation.type === "showMessage") {
        this.message = state.notificationText;
        this.color = state.notificationColor;
        this.show = true;
      }
    });
  },
};
</script>
