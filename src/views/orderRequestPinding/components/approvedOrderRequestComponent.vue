<template>
  <v-dialog
    v-model="approvedDialog"
    min-height="200px"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">هل انت متأكد من قبول الطلب ؟</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-actions>
        <div style="width: 100%;text-align: center; ">
          <v-btn @click="confirm" class="white--text" color="#536DFE">
            <v-icon>save</v-icon>
            <span>تأكيد</span>
          </v-btn>
          <v-btn
            class="mr-2 white--text"
            @click="closeApprovedDialog"
            color="#E91D62"
          >
            <v-icon style="font-size: 19px;" dark>clear</v-icon>
            <span>إلغاء</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import { EventBus } from "../../../eventBus.js";
import { mapActions } from "vuex";
export default {
  props: {
    approvedItemProp: {},
  },
  name: "approved-Item",
  data: () => ({
    approvedDialog: false,
    approvedItem: {
      orderRequestId: null,
    },
    defaultItem: {
      orderRequestId: null,
    },
  }),
  watch: {
    approvedItemProp: {
      handler(data) {
        if (data) this.displayApprovedDialog(data);
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      ApprovedOrderRequest: "orderRequestStore/ApprovedOrderRequest",
    }),

    confirm() {
      this.$store.dispatch("loading", true);
      try {
        this.$store.dispatch("loading", true);
        this.ApprovedOrderRequest(this.approvedItem)
          .then((res) => {
            this.notify(`${res}`, "#1d262d");
            this.$emit("refresh-data");
          })
          .catch((error) => {
            this.notify(`${error}`, "#1d262d");
            this.$store.dispatch("loading", false);
          });
      } catch (error) {
        this.$store.dispatch("loading", false);
        this.notify(error, "#1d262d");
      }
    },

    displayApprovedDialog(item) {
      this.approvedItem.orderRequestId = item.orderRequestId;
      this.approvedDialog = true;
    },

    closeApprovedDialog() {
      this.approvedItem = Object.assign({}, this.defaultItem);
      this.approvedDialog = false;
      this.$emit("close-dialog");
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
