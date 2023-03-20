<template>
  <div>
    <v-card elevation="3" height="auto" class="px-5">
      <v-row>
        <v-subheader>
          <v-icon class="mx-2">search</v-icon>
          بحث علي طلب دفتر صكوك
        </v-subheader>
      </v-row>
      <v-form ref="formSearch" v-model="valid">
        <v-row dense class="px-5">
          <v-col dense cols="12" sm="6" md="4">
            <v-text-field
              v-model="searchName"
              label="رقم الإشاري"
              clearable
              :rules="
                searchName
                  ? [
                      validationInput.isEmpty,
                      validationInput.numberOnly,
                      validationInput.numberNotZero,
                    ]
                  : []
              "
              dense
              prepend-icon="mdi-ticket-confirmation"
              persistent-hint
            ></v-text-field>
          </v-col>

          <v-col cols="12" sm="6" md="4" v-if="hasPermassion(['AdminSystem'])">
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
              :rules="[validationInput.selectedValidation]"
              required
              prepend-icon="mdi-bank"
              @change="getRegionByBankId"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" sm="6" md="4" v-if="hasPermassion(['AdminSystem','BranchAllReport'])">
            <v-autocomplete
              v-model="selectedRegion"
              :items="regions"
              :loading="isLoadingRegion"
              single-line
              :search-input.sync="searchRegion"
              item-text="regionName"
              item-value="bankRegionId"
              label="اختر المنطقة"
              placeholder="بحث عن طريق المنطفة"
              return-object
              no-data-text="قم بالبحث عن منطقة"
              clearable
              @keyup="getBankRegions"
              @change="getBranchByRegionId"
              dense
              prepend-icon="mdi-map-marker"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" sm="6" md="4" v-if="hasPermassion(['AdminSystem','BranchAllReport'])">
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
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-select
              v-model="selectOrderRequestType"
              :items="enumModel.OrderRequestTypeList"
              label="بحث عن طريق نوع الطلب"
              item-text="name"
              item-value="id"
              dense
              clearable
              persistent-hint
              prepend-icon="mdi-account-search"
            ></v-select>
          </v-col>

          <v-col cols="12" sm="6" md="4">
            <v-menu
              ref="menu1"
              v-model="menu1"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              dense
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filterData.from"
                  label="من تاريخ"
                  hint="YYYY-MM-DD"
                  persistent-hint
                  dense
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  @blur="filterData.from = parseDate(dateFormattedFrom)"
                  readonly
                  v-on="on"
                  clearable
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filterData.from"
                no-title
                @input="menu1 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-menu
              ref="menu2"
              v-model="menu2"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              dense
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="filterData.to"
                  label="إلي تاريخ"
                  hint="YYYY-MM-DD"
                  persistent-hint
                  dense
                  prepend-icon="mdi-calendar"
                  v-bind="attrs"
                  @blur="filterData.to = parseDate(dateFormattedTo)"
                  readonly
                  v-on="on"
                  clearable
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="filterData.to"
                no-title
                @input="menu2 = false"
              ></v-date-picker>
            </v-menu>
          </v-col>

          <v-col cols="12" class="text-center mb-3">
            <v-btn
              v-if="filterIsSelected"
              color="#081D38"
              class="white--text"
              @click="searchData"
              :disabled="!valid"
              >بــحــث</v-btn
            >
            <v-btn
              v-if="isSearchData"
              color="red"
              class="white--text mx-3"
              @click="clearFilterData"
              :disabled="!valid"
              >إلغاء البحث</v-btn
            >
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

import * as enums from "../../../models/enum.js";
import { validationInput } from "../../../models/validationInput.js";

import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

export default {
  name: "Serach-compnent",
  props: {
    otherProcess: {},
  },
  data: () => ({
    menu1: false,
    menu2: false,
    valid: false,
    validationInput: validationInput,

    filterData: {
      branchId: null,
      bankId: null,
      identityNo: null,
      orderRequestState: null,
      fromSerial: null,
      toSerial: null,
      from: null,
      to: null,
      pageNo: 1,
      pageSize: 30,
    },

    defaultFilterData: {
      branchId: null,
      bankId: null,
      identityNo: null,
      orderRequestState: null,
      fromSerial: null,
      toSerial: null,
      from: null,
      to: null,
      pageNo: 1,
      pageSize: 30,
    },

    enumModel: enums,

    isSearchData: false,
    selectOrderRequestType: null,

    isLoading: false,
    selectedBank: null,
    searchBank: null,
    filterBankData: {
      bankName: null,
    },

    regions: [],
    isLoadingRegion: false,
    selectedRegion: null,
    searchRegion: null,
    filterRegionData: {
      bankId: null,
      regionName: null,
    },

    branchs: [],
    isLoadingBranch: false,
    selectedBranch: null,
    searchBranch: null,
    filterBranchData: {
      branchRegionId: null,
      nameOrNumber: null,
    },

    searchName: "",
  }),

  watch: {
    searchName(val) {
      this.filterData.identityNo = val;
    },

    searchRegion(val) {
      this.filterRegionData.regionName = val;
    },

    searchBranch(val) {
      this.filterBranchData.nameOrNumber = val;
    },
    selectedRegion(val) {
      if (!val) this.clearBranchData();
    },
    searchBank(val) {
      if (this.isLoading) return;

      this.filterBankData.bankName = val;
    },
    selectedBank(val) {
      if (!val) this.clearRegionData();
    },
  },

  computed: {
    filterIsSelected() {
      if (
        this.filterData.identityNo ||
        this.selectedBranch ||
        this.selectOrderRequestType ||
        (this.filterData.from && this.filterData.to)
      )
        return true;
      else return false;
    },

    dateFormattedFrom() {
      return this.formatDate(this.filterData.from);
    },
    dateFormattedTo() {
      return this.formatDate(this.filterData.to);
    },

    ...mapFields("bankStore", {
      banks: "grids",
    }),
  },
  methods: {
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;

      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },

    ...mapActions({
      GetActiveBankRegions: "bankRegionStore/GetActiveBankRegions",
      GetActiveBranchs: "branchStore/GetActiveBranchs",
      GetBankStore: "bankStore/GetBanks",
    }),
    hasPermassion(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },

    searchData() {
      this.filterData.branchId = this.selectedBranch?.id ?? null;
      this.filterData.orderRequestType = this.selectOrderRequestType ?? null;

      this.isSearchData = true;
      this.$emit("search-data", this.filterData);
    },

    clearFilterData() {
      this.clearData();
      this.isSearchData = false;
      this.$emit("search-data", this.filterData);
    },

    clearData() {
      this.filterData = Object.assign({}, this.defaultFilterData);
      this.selectOrderRequestType = null;
      this.clearRegionData();
      this.clearBranchData();
      this.clearBankData();
    },

    getRegionByBankId() {
      if (!this.selectedBank) return;
      this.clearRegionData();
      this.filterRegionData.bankId = this.selectedBank?.bankId;
      this.getBankRegions();
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

    getBranchByRegionId() {
      this.clearBranchData();
      if (!this.selectedRegion) {
        return;
      }
      this.filterBranchData.branchRegionId = this.selectedRegion?.bankRegionId;
      this.getBranchs();
    },

    getBankRegions() {
      this.isLoadingRegion = true;
      this.GetActiveBankRegions(this.filterRegionData)
        .then(() => {
          this.regions = [
            ...this.$store.getters["bankRegionStore/GET_ACTIVE_BANKREGIONS"],
          ];
          this.isLoadingRegion = false;
        })
        .catch(() => {
          // this.notify(`${error}`, "#1d262d");
          this.isLoadingRegion = false;
        });
    },

    getBranchs() {
      if (!this.selectedRegion) return;

      this.isLoadingBranch = true;
      this.GetActiveBranchs(this.filterBranchData)
        .then(() => {
          this.branchs = [
            ...this.$store.getters["branchStore/GET_ACTIVE_BRANCHS"],
          ];
          this.isLoadingBranch = false;
        })
        .catch(() => {
          // this.notify(`${error}`, "#1d262d");
          this.isLoadingBranch = false;
        });
    },

    clearRegionData() {
      this.clearBranchData();
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
      this.filterBranchData.branchRegionId = null;
      this.filterBranchData.nameOrNumber = null;
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
