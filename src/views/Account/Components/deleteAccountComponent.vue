<template>
  <v-dialog
    v-model="deleteDialog"
    min-height="200px"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">هل انت متأكد من عملية حذف الحساب ؟</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-actions>
        <div style="width: 100%;text-align: center; ">
          <v-btn @click="confirmDelete" class="white--text" color="#536DFE">
            <v-icon>save</v-icon>
            <span>حذف</span>
          </v-btn>
          <v-btn
            class="ma-3"
            @click="closeDeleteDialog"
            outlined color="#E91D62">
            <v-icon style="font-size: 19px;" dark>clear</v-icon>
            <span>رجوع</span>
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
    deleteItemProp: {},
  },
  name: "Delete-Item",
  data: () => ({
    deleteDialog: false,
    deleteItem: {
      id: null,
    },
    defaultItem: {
      id: null,
    },
  }),
  watch: {
   
    deleteItemProp: {
      handler(data) {
        if (data) this.displayDeleteDialog(data);
      },
      immediate: true,
    },
  },
  
  methods: {
    ...mapActions({
      DeleteAccountAction: "accountStore/DeleteAccount",
    }),
    confirmDelete() {

      this.$store.dispatch("loading", true);
      this.DeleteAccountAction(this.deleteItem)
        .then((res) => {
          this.$emit("refresh-data");
          this.notify(`${res}`, "#1d262d");
          this.closeDeleteDialog();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
      
    },

    displayDeleteDialog(item) {
      this.deleteItem.id = item.id;
      this.deleteDialog = true;
    },

    closeDeleteDialog() {
      this.deleteItem = Object.assign({}, this.defaultItem);
      this.deleteDialog = false;
      this.$emit("close-delete-dialog");
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
