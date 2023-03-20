<template>
  <v-dialog
    v-model="deleteDialog"
    min-height="200px"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">هل انت متأكد من إلغاء المنطقة ؟</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-actions>
        <div style="width: 100%;text-align: center; ">
          <v-btn
            @click="confirmDelete"
            class="mx-2 white--text"
            color="#536DFE"
          >
            <v-icon>save</v-icon>
            <span>تأكيد</span>
          </v-btn>
          <v-btn
            
            @click="closeDeleteDialog"
            class="mx-2 white--text"
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
import { EventBus } from "../../../eventBus.js";
import { mapActions } from "vuex";
export default {
  props: {
    deleteDlgProp: {},
    deleteItemProp: {},
  },
  name: "Delete-Item",
  data: () => ({
    deleteDialog: false,
    deleteItem: {
      bankRegionId: null,
    },
    defaultItem: {
      bankRegionId: null,
    },
  }),
  watch: {
    deleteDlgProp: {
      handler(data) {
        this.deleteDialog = data;
      },
      immediate: true,
    },
    deleteItemProp: {
      handler(data) {
        if (data) this.displayDeleteDialog(data);
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      DeleteBankRegionStore: "bankRegionStore/DeleteBankRegion",
    }),
    confirmDelete() {
      this.$store.dispatch("loading", true);
      this.DeleteBankRegionStore(this.deleteItem)
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.$store.dispatch("loading", false);
          EventBus.$emit("refreshRegions");
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
      this.closeDeleteDialog();
    },

    displayDeleteDialog(item) {
      this.deleteItem.bankRegionId = item.bankRegionId;
      this.deleteDialog = true;
    },

    closeDeleteDialog() {
      this.deleteItem = Object.assign({}, this.defaultItem);
      this.deleteDialog = false;
      EventBus.$emit("closeDeleteDialogBankRegion");
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
