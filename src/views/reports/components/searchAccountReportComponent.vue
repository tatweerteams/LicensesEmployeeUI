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
              label="رقم الحساب المصرفي"
              clearable
              :rules="[
                validationInput.isEmpty,
                validationInput.numberOnly,
                validationInput.numberNotZero,
              ]"
              dense
              prepend-icon="mdi-ticket-confirmation"
              persistent-hint
              hint="يجب إدخال رقم الحساب"
            ></v-text-field>
          </v-col>
          <v-col dense cols="12" sm="6" md="4">
            <v-text-field
              v-model="filterData.phoneNo"
              label="رقم الهاتف"
              clearable
              dense
              prepend-icon="mdi-phone"
            ></v-text-field>
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
              v-model="filterData.orderRequestType"
              :items="enumModel.OrderRequestTypeList"
              label="بحث عن طريق نوع الحساب"
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
              >فلترة البيانات</v-btn
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
      accountNo: null,
      phoneNo: "",
      from: null,
      to: null,
      pageNo: 1,
      pageSize: 30,
    },

    enumModel: enums,

    regions: [],
    isLoadingRegion: false,
    selectedRegion: null,
    searchRegion: null,
    filterRegionData: {
      //   bankId: null,
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
      this.filterData.accountNo = val;
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

    filterIsSelected(val) {
      if (!val) this.searchData();
    },
  },

  computed: {
    filterIsSelected() {
      return (
        this.filterData.accountNo ||
        this.filterData.branchId ||
        this.selectedBranch ||
        (this.filterData.from && this.filterData.to)
      );
      //   ||
      //     this.filterData.requestState ||
      //     this.filterData.orderRequestType
    },

    dateFormattedFrom() {
      return this.formatDate(this.filterData.from);
    },
    dateFormattedTo() {
      return this.formatDate(this.filterData.to);
    },
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

      this.$emit("search-data", this.filterData);
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
