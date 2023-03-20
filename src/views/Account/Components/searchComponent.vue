<template>
  <div>
    <v-card elevation="3" height="auto" class="px-5">
      <v-row>
        <v-subheader>
          <v-icon class="mx-2">search</v-icon>
          بحث عن حساب مصرفي  
        </v-subheader>
      </v-row>

      <v-row dense class="px-5">
        <v-col dense cols="12" sm="6" md="3">
          <v-text-field v-model="searchName" label=" إسم/رقم الحساب" clearable prepend-icon="mdi-numeric">
          </v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="3" v-if="hasPermassion(['AdminSystem'])">
          <v-autocomplete v-model="selectedBank" :items="banks" :loading="isLoading" single-line
            :search-input.sync="searchBank" item-text="name" item-value="bankId" label="اختر المصرف"
            placeholder="بحث عن طريق المصرف" return-object no-data-text="قم بالبحث عن اسم المصرف" clearable
            prepend-icon="mdi-bank" @change="getRegionByBankId"></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="3" v-if="hasPermassion(['AdminSystem','DislpayAccountsOfOtherBranches'])">
          <v-autocomplete v-model="selectedRegion" :items="regions" :loading="isLoadingRegion" single-line
            :search-input.sync="searchRegion" item-text="regionName" item-value="bankRegionId" label="اختر المنطقة"
            placeholder="بحث عن طريق المنطفة" return-object no-data-text="لايوجد بيانات" clearable
            prepend-icon="mdi-map-marker" @change="getBranchesByRegionId"></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="3" v-if="hasPermassion(['AdminSystem','DislpayAccountsOfOtherBranches'])">
          <v-autocomplete v-model="selectedBranch" :items="activeBranchs" :loading="isLoadingBranch" single-line
            :search-input.sync="searchBranch" item-text="name" item-value="id" label="اختر الفرع"
            placeholder="بحث عن طريق الفرع" return-object no-data-text="لايوجد بيانات" clearable
            prepend-icon="mdi-map-marker"></v-autocomplete>
        </v-col>

        <v-col cols="12" sm="6" md="3">
          <v-select :items="accountTypeOptions" item-text="text" item-value="value" v-model="selectAccountType"
            label="نوع الحساب" placeholder="نوع الحساب" no-data-text="لايوجد بيانات" return-object single-line
            clearable></v-select>
        </v-col>

        <v-col cols="12" class="text-center mb-3">
          <v-btn  color="#081D38" class="white--text" @click="searchData">فلترة البيانات</v-btn>
          <!-- v-if="filterIsSelected" -->
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  data: () => ({

    banks: [],
    regions: [],
    activeBranchs: [],

    filterData: {
      nameOrNumber: null,
      bankId: null,
      accountType: 0,
      bankRegionId: "",
      branchId: "",
      pageNo: 1,
      pageSize: 30,
    },

    accountTypeOptions: [
      { text: "افراد", value: 1 },
      { text: "شركات", value: 2 },
    ],

    filterBankData: {
      bankName: null,
    },
    selectAccountType: 0,
    selectedBank: null,
    searchBank: null,
    searchBranch: null,

    isLoading: false,
    searchName: "",

    isLoadingRegion: false,
    isLoadingBranch: false,
    selectedRegion: null,
    searchRegion: null,
    filterRegionData: {
      bankId: null,
      regionName: null,
    },

    selectedBranch: null,
    filterBranchData: {
      branchRegionId: null,
      NameOrNumber: null,
    },

    
  }),

  watch: {

    searchName(val) {
      this.filterData.nameOrNumber = val;
      
      if(!val){
        this.searchData();
      }
    },

    selectAccountType(val){
      if (!val) this.searchData();
    },

    searchBank(val) {
      if (this.isLoading) return;
      this.filterBankData.bankName = val;
      this.getBanks();
    },

    searchRegion(val) {
      if (this.isLoadingRegion) return;
      this.filterRegionData.regionName = val;
      this.getBankRegions();
    },

    selectedBank(val) {
      if (!val) {
        this.clearRegionData();
        this.searchData();
      }
    },

    selectedRegion(val) {
      if (!val) {
        this.clearRegionData();
        this.searchData();
      }
    },

    selectedBranch(val){
      if (!val) {
        this.clearBranchData();
        this.searchData();
      }
    },

    searchBranch(val) {
      if (this.isLoadingBranch) return;
      if (this.selectedRegion) {
        this.filterBranchData.branchRegionId = this.selectedRegion?.bankRegionId;
        this.filterBranchData.NameOrNumber = val;
        this.GetBranches();
      }
    },


  },

  computed: {
  },
  methods: {

    ...mapActions({
      GetActiveBankRegions: "bankRegionStore/GetActiveBankRegions",
      GetBankStore: "bankStore/GetBanks",
      GetActiveBranchesAction: "branchStore/GetActiveBranchs",
    }),

    hasPermassion(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },

    searchData() {
      this.filterData.bankId = this.selectedBank?.bankId ?? null;
      this.filterData.bankRegionId = this.selectedRegion?.bankRegionId ?? null;
      this.filterData.branchId = this.selectedBranch?.id ?? null;
      this.filterData.accountType = this.selectAccountType?.value ?? 0;

      this.$emit("search-data", this.filterData);
    },

    getRegionByBankId() {
      this.filterRegionData.bankId = this.selectedBank?.bankId;
      this.getBankRegions();
    },

    getBranchesByRegionId() {
      this.filterBranchData.branchRegionId = this.selectedRegion?.bankRegionId;
      this.GetBranches();
    },

    getBankRegions() {
      // if (!this.selectedBank) return;
      // this.filterRegionData.bankId = this.selectedBank?.bankId;
      try {
        this.isLoadingRegion = true;
        this.GetActiveBankRegions(this.filterRegionData)
          .then(() => {

            this.regions = [];
            this.regions = [
              ...this.$store.getters["bankRegionStore/GET_ACTIVE_BANKREGIONS"],
            ];
            this.isLoadingRegion = false;
          })
          .catch(() => {
            // this.notify(`${error}`, "#1d262d");
            this.isLoadingRegion = false;
          });
      } catch (error) {
        this.isLoadingRegion = false;
        this.notify(error, "#1d262d");
      }
    },

    GetBranches() {
      try {
        this.isLoadingBranch = true;
        this.GetActiveBranchesAction(this.filterBranchData)
          .then(() => {
            
            this.activeBranchs = [
              ...this.$store.getters["branchStore/GET_ACTIVE_BRANCHS"],
            ];
            this.isLoadingBranch = false;

          })
          .catch(() => {
            // this.notify(`${error}`, "#1d262d");
            this.isLoadingBranch = false;
          });
      } catch (error) {
        this.isLoadingBranch = false;
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
      this.clearBranchData();
    },

    clearBranchData() {
      this.isLoadingBranch = false;
      this.activeBranchs = [];
      this.searchBranch = null;
      this.selectedBranch = null;
      this.filterBranchData.branchRegionId = null;
      this.filterBranchData.NameOrNumber = null;
    },

    getBanks() {
      try {
        this.isLoading = true;
        this.GetBankStore(this.filterBankData)
          .then(() => {

            this.banks = [];
            this.banks = [
              ...this.$store.getters["bankStore/GET_ACTIVE_BANKS"],
            ];
            this.isLoading = false;

          })
          .catch(() => {
            // this.notify(`${error}`, "#1d262d");
            this.isLoading = false;
          });
      } catch (error) {
        this.isLoading = false;
        this.notify(error, "#1d262d");
      }
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },

  },
};
</script>

<style>

</style>
