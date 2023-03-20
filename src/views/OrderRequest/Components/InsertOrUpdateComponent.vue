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
          <v-icon class="ml-2">mdi-plus-circle</v-icon><span>إنشاء طلب</span>
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
          <v-form ref="formOrderRequest" v-model="valid">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  prepend-icon="location_city"
                  v-model="note"
                  dense
                  :rules="
                    note
                      ? [
                          validationInput.isEmpty,
                          validationInput.isArabic,
                          validationInput.minLength,
                          validationInput.currectInput,
                        ]
                      : []
                  "
                  label="مــلاحــظة"
                  maxLength="50"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                v-if="hasPermassion(['AddOrderRequestOtherBranch','AdminSystem'])"
              >
                <v-autocomplete
                  v-model="selectedRegion"
                  :items="regions"
                  :loading="isLoadingRegion"
                  single-line
                  :search-input.sync="searchRegion"
                  item-text="regionName"
                  item-value="bankRegionId "
                  label="اختر المنطقة"
                  placeholder="بحث عن طريق المنطفة"
                  return-object
                  :rules="isInsert ? [validationInput.selectedValidation] : []"
                  required
                  no-data-text="قم بالبحث عن منطقة"
                  clearable
                  @keyup="getBankRegions"
                  @change="getBranchByRegionId"
                  dense
                  prepend-icon="mdi-map-marker"
                ></v-autocomplete>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                v-if="hasPermassion(['AddOrderRequestOtherBranch','AdminSystem'])"
              >
                <v-autocomplete
                  v-model="selectedBranch"
                  :items="branchs"
                  :loading="isLoadingBranch"
                  single-line
                  :search-input.sync="searchBranch"
                  item-text="name"
                  item-value="id"
                  label="اختر الفرع"
                  placeholder="بحث عن طريق الفرع"
                  return-object
                  no-data-text="لايوجد بيانات"
                  clearable
                  @keyup="getBranchs"
                  prepend-icon="mdi-bank"
                  dense
                  :rules="isInsert ? [validationInput.selectedValidation] : []"
                  required
                ></v-autocomplete>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  v-model="orderRequestType"
                  :items="enumModel.OrderRequestTypeList"
                  label="اختر نوع الطلب"
                  item-text="name"
                  item-value="id"
                  dense
                  :rules="[validationInput.selectedValidation]"
                  clearable
                  persistent-hint
                  prepend-icon="mdi-account-search"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="12" v-if="hasPermassion(['AdminSystem','PrintOrderReqeustOutCenter'])">
                <v-switch
                  label="طباعة الطلبية خارج مركز الطباعة"
                  color="#536DFE"
                  hide-details
                  dense
                  class="justify-center text-center d-inline-block"
                  v-model="printOutCenter"
                ></v-switch>
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
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

import { validationInput } from "../../../models/validationInput.js";
import * as enums from "../../../models/enum.js";
export default {
  name: "insert-Or-Update-OrderRequest",
  props: {
    updateItemProp: {},
    dialogProp: {},
  },
  components: {},

  data: () => ({
    dialog: false,
    valid: false,
    validationInput: validationInput,
    enumModel: enums,

    branchs:[],
    isLoadingBranch: false,
    selectedBranch: null,
    searchBranch: null,
    filterBranchData: {
      branchRegionId: null,
      nameOrNumber: null,
    },

    regions:[],
    isLoadingRegion: false,
    selectedRegion: null,
    searchRegion: null,
    filterRegionData: {
      regionName: null,
    },
  }),

  computed: {
    ...mapFields("orderRequestStore", {
      note: "editedItem.note",
      orderRequestId: "editedItem.id",
      branchId: "editedItem.branchId",
      orderRequestType: "editedItem.orderRequestType",
      printOutCenter: "editedItem.printOutCenter",
    }),

    // ...mapFields("bankRegionStore", {
    //   regions: "activeBankRegions",
    // }),

    // ...mapFields("branchStore", {
    //   branchs: "activeBranchs",
    // }),

    formTitle() {
      return this.orderRequestId ? "تعديل بيانات الطلب" : "إنشاء طلب جديد";
    },

    isInsert() {
      return !this.orderRequestId;
    },
  },

  watch: {
    updateItemProp: {
      handler(data) {
        if (data) this.editSelected(data);
      },
      immediate: true,
    },
    searchRegion(val) {
      this.filterRegionData.regionName = val;
    },

    searchBranch(val) {
      // if(this.isLoadingBranch) return;
      this.filterBranchData.nameOrNumber = val;
    },

    selectedRegion(val) {
      if (!val) this.clearBranchData();
    },
  },
  methods: {
    hasPermassion(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },
    ...mapActions({
      ClearDataItemStore: "orderRequestStore/ClearDataItem",
      SetDataUpdateStore: "orderRequestStore/SetDataUpdate",
      InsertOrderRequest: "orderRequestStore/InsertOrderRequest",
      UpdateOrderRequest: "orderRequestStore/UpdateOrderRequest",
      GetActiveBankRegions: "bankRegionStore/GetActiveBankRegions",
      GetActiveBranchs: "branchStore/GetActiveBranchs",
    }),
    openDialog() {
      this.dialog = true;
      this.getBankRegions();
    },

    getBranchByRegionId() {
      this.clearBranchData();
      if(!this.selectedRegion)
      {
        return ;
      }
      this.getBranchs();
    },

    getBankRegions() {
      this.isLoadingRegion = true;
      this.GetActiveBankRegions(this.filterRegionData)
        .then(() => {
          this.regions=[...this.$store.getters["bankRegionStore/GET_ACTIVE_BANKREGIONS"]];
          this.isLoadingRegion = false;
        })
        .catch(() => {
          // this.notify(`${error}`, "#1d262d");
          this.isLoadingRegion = false;
        });
    },

    clearRegionData() {
      this.isLoadingRegion = false;
      this.regions = [];
      this.selectedRegion = null;
      this.searchRegion = null;
      this.filterRegionData.bankId = null;
      this.filterRegionData.regionName = null;
    },
    clearBranchData() {
      this.isLoadingBranch = false;
      this.branchs = [];
      this.selectedBranch = null;
      this.searchBranch = null;
      this.filterBranchData.nameOrNumber = null;
      this.filterBranchData.branchRegionId = null;
    },

    getBranchs() {
      if (!this.selectedRegion) return;
      this.filterBranchData.branchRegionId = this.selectedRegion?.bankRegionId;
      this.isLoadingBranch = true;
      this.GetActiveBranchs(this.filterBranchData)
        .then(() => {
          this.branchs=[...this.$store.getters["branchStore/GET_ACTIVE_BRANCHS"]];
          this.isLoadingBranch = false;
        })
        .catch(() => {
          // this.notify(`${error}`, "#1d262d");
          this.isLoadingBranch = false;
        });
    },

    editSelected(item) {
      this._selectedBranchEdit(item);
      this._selectedBankRegionEdit(item);
      this.SetDataUpdateStore(item);
      this.dialog = true;
    },

    _selectedBranchEdit(item) {
      if (item.branchId && item.branchName) {
        this.branchs.push({
          name: item.branchName,
          id: item.branchId,
        });

        this.selectedBranch = this.branchs.find(
          (pred) => pred.id == item.branchId
        );
      }
    },
    _selectedBankRegionEdit(item) {
      if (item.branchRegionId && item.regionName) {
        this.regions.push({
          regionName: item.regionName,
          bankRegionId: item.branchRegionId,
        });

        this.selectedRegion = this.regions.find(
          (pred) => pred.bankRegionId == item.branchRegionId
        );
      }
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.ClearDataItemStore();
        this.clearBranchData();
        this.clearRegionData();
      }, 300);
      this.resetValidation();
      EventBus.$emit("closeDialogUpdateOrderRequest");
    },

    save() {
      if (this.orderRequestId) {
        this.updateOrderRequest();
      } else {
        this.insertOrderRequest();
      }
    },

    insertOrderRequest() {
      this.branchId = this.selectedBranch?.id ?? null;
      this.$store.dispatch("loading", true);
      this.InsertOrderRequest()
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.$emit("refresh-data");
          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    updateOrderRequest() {
      this.branchId = this.selectedBranch?.id ?? null;
      this.$store.dispatch("loading", true);
      this.UpdateOrderRequest()
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.$emit("refresh-data");
          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    resetValidation() {
      this.$refs.formOrderRequest?.reset();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
