<template>
  <v-dialog
    v-model="rejectDialog"
    min-height="200px"
    max-width="500px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="headline">هل انت متأكد من رفض الطلب ؟</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text>
        <v-row class="mt-2">
          <v-col cols="12">
            <v-form ref="formRejectOrder" v-model="valid">
              <v-autocomplete
                v-model="selectedReasonRefuses"
                :items="activeReasonRefuses"
                dense
                :loading="isLoading"
                :search-input.sync="searchReasonRefuse"
                @keyup="getReasonRefuses"
                item-text="name"
                item-value="name"
                label="اختر سبب الرفض"
                placeholder="يجب إختيار سبب الرفض"
                no-data-text="لايوجد بيانات"
                clearable
                :rules="[validationInput.selectedListValidation]"
                required
                multiple
                prepend-icon="mdi-file-document-alert"
              >
                <template v-slot:selection="{ item, index }">
                  <v-chip v-if="index <= 1">
                    <span>{{ item.name }}</span>
                  </v-chip>
                  <span v-if="index === 2" class="grey--text text-caption">
                    (+{{ selectedReasonRefuses.length - 2 }} أخري)
                  </span>
                </template>
              </v-autocomplete>
            </v-form>
          </v-col>
           
        </v-row>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center; ">
          <v-btn
            @click="confirm"
            :disabled="!valid"
            class="white--text"
            color="#536DFE"
          >
            <v-icon>save</v-icon>
            <span>تأكيد</span>
          </v-btn>
          <v-btn
            class="mr-2 white--text"
            @click="closeRejectDialog"
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
import { validationInput } from "../../../models/validationInput.js";
import { mapActions } from "vuex";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  props: {
    rejectRequestItemProp: {},
  },
  name: "reject-order-request",
  data: () => ({
    rejectDialog: false,
    valid: false,
    rejectItem: {
      orderRequestId: null,
      rejectNote: null,
    },
    defaultItem: {
      orderRequestId: null,
      rejectNote: null,
    },
    validationInput: validationInput,

    searchReasonRefuse: null,
    isLoading: false,
    selectedReasonRefuses: [],
    filterReasonRefuse: {
      name: null,
    },
  }),

  computed: {
    ...mapFields("reasonRefuseStore", {
      activeReasonRefuses: "activeReasonRefuses",
    }),
  },

  watch: {
    rejectRequestItemProp: {
      handler(data) {
        if (data) this.displayRejectDialog(data);
      },
      immediate: true,
    },
    searchReasonRefuse(val) {
      if (this.isLoading) return;
      this.filterReasonRefuse.name = val;
    },
  },

  methods: {
    ...mapActions({
      RejectOrderRequest: "orderRequestStore/RejectOrderRequest",
      GetActiveReasonRefusesStore: "reasonRefuseStore/GetActiveReasonRefuses",
    }),

    confirm() {
      if(this.selectedReasonRefuses.length==0)
      return;

      this.rejectItem.rejectNote=this.selectedReasonRefuses.join('_')

      this.$store.dispatch("loading", true);
      try {
        this.$store.dispatch("loading", true);
        this.RejectOrderRequest(this.rejectItem)
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

    getReasonRefuses() {
      try {
        this.isLoading = true;
        this.GetActiveReasonRefusesStore(this.filterReasonRefuse)
          .then(() => {
            this.isLoading = false;
          })
          .catch((error) => {
            this.notify(`${error}`, "#1d262d");
            this.isLoading = false;
          });
      } catch (error) {
        this.isLoading = false;
        this.notify(error, "#1d262d");
      }
    },

    displayRejectDialog(item) {
      this.rejectItem.orderRequestId = item.orderRequestId;
      this.rejectDialog = true;
      this.getReasonRefuses();
    },

    closeRejectDialog() {
      this.rejectItem = Object.assign({}, this.defaultItem);
      this.rejectDialog = false;
      this.resetValidation();
      this.$emit("close-dialog");
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
    resetValidation() {
      this.$refs.formRejectOrder?.reset();
    },
  },
};
</script>

<style></style>
