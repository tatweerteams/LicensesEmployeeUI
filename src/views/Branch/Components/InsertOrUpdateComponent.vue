<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <template v-slot:activator="{ on }">
      <template>
        <v-btn
          color="#536DFE"
          class="white--text "
          @click="openDialog"
          v-on="on"
          elevation="5"
        >
          <v-icon class="ml-2">mdi-plus-circle</v-icon><span> إضافة فرع</span>
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
          <v-form ref="formBranch" v-model="valid">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  prepend-icon="mdi-numeric"
                  v-model="branchNo"
                  label="رقم الفرع"
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.numberOnly,
                    validationInput.minLength,
                    validationInput.numberNotZero,
                  ]"
                  required
                  dense
                  maxLength="3"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  prepend-icon="location_city"
                  v-model="name"
                  dense
                  :rules="[
                    validationInput.isEmpty,
                    validationInput.isArabic,
                    validationInput.minLength,
                    validationInput.currectInput,
                  ]"
                  label="إسم الفرع"
                  required
                  maxLength="50"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" v-if="hasPermassion(['AdminSystem'])">
                <v-autocomplete
                  v-model="selectedBank"
                  :items="banks"
                  dense
                  :loading="isLoading"
                  single-line
                  :search-input.sync="searchBank"
                  @keyup="getBanks"
                  item-text="name"
                  item-value="bankId"
                  label="اختر المصرف"
                  placeholder="يجب إختيار المصرف"
                  return-object
                  no-data-text="قم بالبحث عن اسم المصرف"
                  clearable
                  :disabled="!isInsert"
                  :rules="isInsert ? [validationInput.selectedValidation] : []"
                  required
                  prepend-icon="mdi-bank"
                  @change="getRegionByBankId"
                ></v-autocomplete>
              </v-col>
              <!--  -->
              <v-col
                cols="12"
                sm="6"
                v-if="hasPermassion(['AddBranchOtherRegions','AdminSystem'])"
              >
                <v-autocomplete
                  v-model="selectedRegion"
                  :items="regions"
                  :loading="isLoadingRegion"
                  single-line
                  dense
                  :disabled="!isInsert"
                  :rules="isInsert ? [validationInput.selectedValidation] : []"
                  required
                  :search-input.sync="searchRegion"
                  item-text="regionName"
                  item-value="bankRegionId"
                  label="اختر المنطقة"
                  placeholder="يجب إختيار المنطقة"
                  return-object
                  no-data-text="قم يالبحث عن اسم المنطقة"
                  clearable
                  @keyup="getBankRegions"
                  prepend-icon="mdi-map-marker"
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                v-if="hasPermassion(['AdminSystem']) || isInsert"
              >
                <v-text-field
                  prepend-icon="mdi-numeric"
                  v-model="lastSerialCertified"
                  :rules="[validationInput.numberOnly]"
                  label="أخر تسلسل صكوك المصدقة"
                  required
                  dense
                  maxLength="10"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                v-if="hasPermassion(['AdminSystem']) || isInsert"
              >
                <v-text-field
                  prepend-icon="mdi-numeric"
                  v-model="lastSerial"
                  label="أخر تسلسل لدفاتر (افراد - شركات )"
                  required
                  :rules="[validationInput.numberOnly]"
                  dense
                  maxLength="10"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                v-if="hasPermassion(['AdminSystem']) || isInsert"
              >
                <v-text-field
                  prepend-icon="mdi-numeric"
                  v-model="lastCountChekBook"
                  label="عداد الطلبيات"
                  :rules="[validationInput.numberOnly]"
                  required
                  dense
                  maxLength="10"
                ></v-text-field>
              </v-col>
            </v-row>
            <template v-if="isInsert">
              <v-row class="mb-5">
                <v-col cols="12">
                  <v-divider color="#E0E0E0"></v-divider>
                </v-col>
                <v-col cols="12">
                  <span class="text-h6"
                    ><v-icon>mdi-cog-outline</v-icon> إعدادات الفرع</span
                  >
                </v-col>
              </v-row>
              <BranchSettingComponent></BranchSettingComponent>
            </template>
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
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

import BranchSettingComponent from "../../SharedComponents/branchSettingComponent.vue";
import { validationInput } from "../../../models/validationInput.js";
export default {
  name: "insert-Or-Update",
  props: {
    updateItemProp: {},
    dialogProp: {},
  },
  components: {
    BranchSettingComponent,
  },

  data: () => ({
    dialog: false,
    valid: false,
    validationInput: validationInput,

    banks:[],
    isLoading: false,
    selectedBank: null,
    searchBank: null,
    filterBankData: {
      bankName: null,
    },

    regions:[],
    isLoadingRegion: false,
    selectedRegion: null,
    searchRegion: null,
    filterRegionData: {
      bankId: null,
      regionName: null,
    },
  }),

  computed: {
    ...mapFields("branchStore", {
      branchNo: "editedItem.branchNo",
      branchId: "editedItem.id",
      name: "editedItem.name",
      branchRegionId: "editedItem.branchRegionId",
      lastSerialCertified: "editedItem.lastSerialCertified",
      lastSerial: "editedItem.lastSerial",
      lastCountChekBook: "editedItem.lastCountChekBook",
    }),

    // ...mapFields("bankRegionStore", {
    //   regions: "activeBankRegions",
    // }),
    // ...mapFields("bankStore", {
    //   banks: "grids",
    // }),

    formTitle() {
      return this.branchId ? "تعديل بيانات الفرع" : "إضافة فرع جديد";
    },

    isInsert() {
      return !this.branchId;
    },
  },

  watch: {
    updateItemProp: {
      handler(data) {
        if (data) this.editSelected(data);
      },
      immediate: true,
    },
    searchBank(val) {
      if (this.isLoading) return;

      this.filterBankData.bankName = val;
    },

    searchRegion(val) {
      if (this.isLoadingRegion) return;
      this.filterRegionData.regionName = val;
    },

    selectedBank(val) {
      if (!val) this.clearRegionData();
    },
  },
  methods: {
    ...mapActions({
      ClearDataItemStore: "branchStore/ClearDataItem",
      SetDataUpdateStore: "branchStore/SetDataUpdate",
      InsertBranchStore: "branchStore/InsertBranch",
      UpdateBranchStore: "branchStore/UpdateBranch",
      GetActiveBankRegions: "bankRegionStore/GetActiveBankRegions",
      GetBankStore: "bankStore/GetBanks",
    }),
    openDialog() {
      this.dialog = true;
    },
    hasPermassion(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },

    

    getRegionByBankId() {
      if (!this.selectedBank) return;
      this.clearRegionData();
      this.filterRegionData.bankId = this.selectedBank?.bankId;
      this.getBankRegions();
    },

    getBankRegions() {
      try {
        this.isLoadingRegion = true;
        this.GetActiveBankRegions(this.filterRegionData)
          .then(() => {
            this.regions=[...this.$store.getters["bankRegionStore/GET_ACTIVE_BANKREGIONS"]];
            this.isLoadingRegion = false;
          })
          .catch(() => {
            this.isLoadingRegion = false;
          });
      } catch (error) {
        this.isLoadingRegion = false;
        this.notify(error, "#1d262d");
      }
    },

    clearRegionData() {
      this.isLoadingRegion = false;
      this.regions = [];
      this.selectedRegion = null;
      this.searchRegion = null;
      this.filterRegionData.bankId = null;
      this.filterRegionData.regionName = null;
    },
    clearBankData() {
      this.isLoading = false;
      this.banks = [];
      this.selectedBank = null;
      this.searchBank = null;
      this.filterBankData.bankName = null;
    },

    getBanks() {
      try {
        this.isLoading = true;
        this.GetBankStore(this.filterBankData)
          .then(() => {
            this.banks = [...this.$store.getters["bankStore/GET_ACTIVE_BANKS"]];
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

    editSelected(item) {
      this._selectedBankEdit(item);
      this._selectedBankRegionEdit(item);
      this.SetDataUpdateStore(item);
      this.dialog = true;
    },

    _selectedBankEdit(item) {
      if (item.bankId && item.bankName) {
        this.banks.push({
          name: item.bankName,
          bankId: item.bankId,
        });
      

        this.selectedBank = this.banks.find(
          (pred) => pred.bankId == item.bankId
        );
      }
    },
    _selectedBankRegionEdit(item) {
      if (item.branchRegionId && item.branchRegionName) {
        this.regions.push({
          regionName: item.branchRegionName,
          bankRegionId: item.branchRegionId,
        });

        this.selectedRegion = this.regions.find(
          (pred) => pred.bankRegionId == item.branchRegionId
        );
      }
    },

    close() {
      setTimeout(() => {
        this.clearBankData();
        this.clearRegionData();
        this.ClearDataItemStore();
      }, 300);
      this.dialog = false;
      this.resetValidation();
      EventBus.$emit("closeDialogUpdateBranch");
    },

    save() {
      if (this.branchId) {
        this.updateBranch();
      } else {
        this.insertBranch();
      }
    },

    insertBranch() {
      this.branchRegionId = this.selectedRegion?.bankRegionId ?? null;
      this.$store.dispatch("loading", true);
      this.InsertBranchStore()
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
    updateBranch() {
      this.$store.dispatch("loading", true);
      this.UpdateBranchStore()
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
      this.$refs.formBranch?.reset();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
