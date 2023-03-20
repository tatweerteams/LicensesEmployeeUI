<template>
  <v-dialog
    v-model="resonRefuseDialog"
    min-height="200px"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">أسباب الرفض</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-textarea
          outlined
          prepend-icon="mdi-file-document-alert"
          v-model="messageReject"
          label="سبب الرفض"
          dense
          autofocus
          readonly
          class="mt-5"
        ></v-textarea>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center; ">
          <v-btn
            @click="closeResonRefuseDialog"
            class="mx-2 white--text"
            color="#E91D62"
          >
            <v-icon style="font-size: 19px;" dark>clear</v-icon>
            <span>إغلاق</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    noteRejectItemProp: {},
  },
  name: "Delete-Item",
  data: () => ({
    resonRefuseDialog: false,

    rejectNote: null,
  }),

  watch: {
    noteRejectItemProp: {
      handler(data) {
        if (data) this.displayResonRefuseDialog(data);
      },
      immediate: true,
    },
  },

  computed: {
    messageReject() {
      if (!this.rejectNote) return "لم يتم إدخال سبب الرفض";

      let values = this.rejectNote?.split("_");

      if (values.length == 0) return "لم يتم إدخال سبب الرفض";
      let index = 0;
      let message = "";
      values.forEach((element) => {
        index++;
        message = message + ` (${index}) ${element} .. \n`;
      });
      return message;
    },
  },

  methods: {
    displayResonRefuseDialog(item) {
      this.rejectNote = item?.orderRequestNote;
      this.resonRefuseDialog = true;
    },

    closeResonRefuseDialog() {
      this.rejectNote = null;
      this.resonRefuseDialog = false;
      this.$emit("close-dialog");
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
