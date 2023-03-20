<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <template v-slot:activator="{ on }">
      <template>
        <v-btn
          color="#536DFE"
          class="white--text "
          @click="openDialog"
          v-on="on"
          elevation="5"
        >
          <v-icon class="ml-2">mdi-plus-circle</v-icon><span> إضافة مصرف</span>
        </v-btn>
      </template>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="formBank" v-model="valid">
            <v-row>
              <v-col cols="6">
                <v-text-field
                  prepend-icon="location_city"
                  v-model="bankNo"
                  label="رقم المصرف"
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.numberOnly,
                    validationInput.numberNotZero,
                    validationInput.minLength,
                  ]"
                  required
                  maxLength="4"
                ></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  prepend-icon="location_city"
                  v-model="bankName"
                  label="إسم المصرف"
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.isArabic,
                    validationInput.currectInput,
                    validationInput.minLength,
                  ]"
                  required
                ></v-text-field>
              </v-col>
              <v-col cols="12" v-if="isInsert">
                <v-select
                  v-model="bankRegions"
                  :items="regions"
                  label="اختر المنطقة"
                  placeholder="اختار مناطق للمصرف"
                  :rules="[validationInput.selectedListValidation]"
                  required
                  item-text="regionName"
                  item-value="regionId"
                  multiple
                  :search-input.sync="searchRegion"
                  @keyup="getRegions"
                  dense
                  chips
                  return-object
                  persistent-hint
                ></v-select>
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
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  name: "insert-Or-Update",
  props: {
    updateItemProp: {},
    dialogProp: {},
  },

  data: () => ({
    dialog: false,
    valid: false,

    validationInput: validationInput,

    searchRegion: null,
    filterDataRegion: {
      regionName: null,
    },
  }),

  computed: {
    ...mapFields("bankStore", {
      bankNo: "editedItem.bankNo",
      bankId: "editedItem.id",
      bankName: "editedItem.name",
      bankRegions: "editedItem.bankRegions",
    }),

    ...mapFields("regionStore", {
      regions: "regions",
    }),

    formTitle() {
      return this.bankId ? "تعديل بيانات المصرف" : "إضافة مصرف جديد";
    },

    isInsert() {
      return !this.bankId;
    },
  },

  watch: {
    dialogProp: {
      handler(data) {
        this.dialog = data;
      },
      immediate: true,
    },

    updateItemProp: {
      handler(data) {
        if (data) this.editSelected(data);
      },
      immediate: true,
    },
    searchRegion(data) {
      this.filterDataRegion.regionName = data;
    },
  },
  methods: {
    ...mapActions({
      InsertBankStore: "bankStore/InsertBank",
      ClearDataItemStore: "bankStore/ClearDataItem",
      UpdateBankStore: "bankStore/UpdateBank",
      SetDataUpdateStore: "bankStore/SetDataUpdate",
      GetRegionStore: "regionStore/GetRegions",
    }),
    openDialog() {
      this.dialog = true;
      this.getRegions();
    },

    getRegions() {
      this.GetRegionStore(this.filterDataRegion)
        .then(() => {})
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
        });
    },

    editSelected(item) {
      this.SetDataUpdateStore(item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.ClearDataItemStore();
        this.resetValidation();
      }, 300);

      EventBus.$emit("closeDialogUpdateBank");
    },

    save() {
      if (this.bankId) {
        this.updateBank();
      } else {
        this.insertBank();
      }
    },

    insertBank() {
      this.$store.dispatch("loading", true);
      this.InsertBankStore()
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          EventBus.$emit("refreshData");
          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },
    updateBank() {
      this.$store.dispatch("loading", true);
      this.UpdateBankStore()
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          EventBus.$emit("refreshData");
          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    resetValidation() {
      this.$refs.formBank?.reset();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
