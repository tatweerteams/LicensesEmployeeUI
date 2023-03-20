<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="formOrderItem" v-model="valid">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  prepend-icon="location_city"
                  v-model="editedItem.accountNo"
                  label="رقم الحساب"
                  required
                  maxLength="15"
                  disabled
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  prepend-icon="location_city"
                  v-model="editedItem.accountName"
                  label="إسم الحساب"
                  required
                  disabled
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  prepend-icon="location_city"
                  v-model="editedItem.countChekBook"
                  label="الكمية"
                  :rules="[
                    validationInput.numberOnly,
                    validationInput.numberNotZero,
                    validationInput.maxNumberCheckBook,
                  ]"
                  required
                  maxLength="4"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center;">
          <v-btn
            @click="save"
            class="mx-2 white--text"
            :disabled="!valid"
            color="#536DFE"
          >
            <v-icon>save</v-icon>
            <span>حفظ البيانات</span>
          </v-btn>
          <v-btn class="mx-2 white--text" @click="close" color="#E91D62">
            <v-icon dark>clear</v-icon>
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

import { validationInput } from "../../../models/validationInput.js";

export default {
  name: "Update-Order-Item",
  props: {
    updateItemProp: {},
  },

  data: () => ({
    dialog: false,
    valid: false,

    validationInput: validationInput,

    editedItem: {
      accountId: null,
      accountNo: null,
      accountName: null,
      countChekBook: 0,
      orderRequestId: null,
      id: null,
    },

    editedItemDefult: {
      accountId: null,
      accountNo: null,
      accountName: null,
      countChekBook: 0,
      orderRequestId: null,
      id: null,
    },
  }),

  computed: {
    formTitle() {
      return "تعديل بيانات الحساب في الطلبية";
    },
  },

  watch: {
    updateItemProp: {
      handler(data) {
        if (data) this.editSelected(data);
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      updateOrderItem: "orderItemStore/UpdateOrderItem",
    }),

    editSelected(item) {
    
      this.editedItem.accountName = item.accountName;
      this.editedItem.accountId = item.accountId;
      this.editedItem.accountNo = item.accountNo;
      this.editedItem.countChekBook = item.countChekBook;
      this.editedItem.orderRequestId = item.orderRequestId;
      this.editedItem.id = item.id;

      this.dialog = true;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.editedItemDefult);
        this.resetValidation();
      }, 300);

      EventBus.$emit("closeDialogUpdateOrderItem");
    },

    save() {
      this.$store.dispatch("loading", true);
      this.updateOrderItem(this.editedItem)
        .then((res) => {
          this.$emit("refresh-data-update");
          this.notify(`${res}`, "#1d262d");

          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    resetValidation() {
      this.$refs.formOrderItem?.reset();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
