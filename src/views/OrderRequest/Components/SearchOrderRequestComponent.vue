<template>
  <div>
    <v-card elevation="3" height="auto" class="px-5">
      <v-row>
        <v-subheader>
          <v-icon class="mx-2">search</v-icon>
          بحث علي طلبية
        </v-subheader>
      </v-row>

      <v-row dense class="px-5">
        <v-col dense cols="12" sm="6" md="4">
          <v-text-field
            v-model="searchName"
            label="رقم الإشاري"
            clearable
            dense
            prepend-icon="mdi-ticket-confirmation"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4" v-if="hasPermassion(['AddOrderRequestOtherBranch','AdminSystem'])">
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

        <v-col cols="12" sm="6" md="4" v-if="hasPermassion(['AddOrderRequestOtherBranch','AdminSystem'])">
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
            label="بحث عن طريق نوع الطلب"
            item-text="name"
            item-value="id"
            dense
            clearable
            persistent-hint
            prepend-icon="mdi-account-search"
          ></v-select>
        </v-col>

        <v-col cols="12" sm="6" md="4" v-if="!otherProcess">
          <v-select
            v-model="filterData.requestState"
            :items="enumModel.OrderRequestStateList"
            label="بحث عن طريق حالة الطلب"
            item-text="name"
            item-value="id"
            dense
            clearable
            persistent-hint
            prepend-icon="mdi-table-search"
          ></v-select>
        </v-col>
        <v-col cols="12" sm="6" md="4" v-if="isOrderReject">
          <v-select
            v-model="filterData.requestState"
            :items="enumModel.OrderRequestStateRejectList"
            label="بحث عن طريق حالة الطلب"
            item-text="name"
            item-value="id"
            dense
            clearable
            persistent-hint
            prepend-icon="mdi-table-search"
          ></v-select>
        </v-col>
        <v-col cols="12" class="text-center mb-3">
          <v-btn
            v-if="filterIsSelected"
            color="#081D38"
            class="white--text"
            @click="searchData"
            >فلترة البيانات</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";


import * as enums from "../../../models/enum.js";

export default {
  name: "Serach-compnent",
  props: {
    otherProcess: {},
    isOrderReject:{},
  },
  data: () => ({
    filterData: {
      branchId: null,
      branchRegionId: null,
      identityNo: "",
      requestState: null,
      orderRequestType: null,
      fromDate: null,
      toDate: null,
      pageNo: 1,
      pageSize: 30,
    },

    enumModel: enums,

    regions:[],
    isLoadingRegion: false,
    selectedRegion: null,
    searchRegion: null,
    filterRegionData: {
      //   bankId: null,
      regionName: null,
    },

    branchs:[],
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
      // if(this.isLoadingBranch) return;
      this.filterBranchData.nameOrNumber = val;
    },
    selectedRegion(val){
      if(!val) this.clearBranchData();
    },

    filterIsSelected(val) {
      if (!val) this.searchData();
    },
  },

  computed: {
    // ...mapFields("bankRegionStore", {
    //   regions: "activeBankRegions",
    // }),

    // ...mapFields("branchStore", {
    //   branchs: "activeBranchs",
    // }),

    filterIsSelected() {
      return (
        this.selectedRegion ||
        this.filterData.identityNo ||
        this.filterData.branchId ||
        this.selectedBranch ||
        this.filterData.requestState ||
        this.filterData.orderRequestType
      );
    },
  },
  methods: {
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
      this.filterData.branchRegionId =
        this.selectedRegion?.bankRegionId ?? null;

      this.filterData.branchId = this.selectedBranch?.id ?? null;

      this.$emit("search-data", this.filterData);
    },

    getBranchByRegionId() {
      this.clearBranchData();
      if(!this.selectedRegion)
      {
        return ;
      }
      this.filterBranchData.branchRegionId = this.selectedRegion?.bankRegionId;
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

    getBranchs() {
      if (!this.selectedRegion) return;

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
