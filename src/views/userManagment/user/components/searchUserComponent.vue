<template>
  <div>
    <v-card elevation="3" height="auto" class="px-5">
      <v-row>
        <v-subheader>
          <v-icon class="mx-2">search</v-icon>
          بحث عن مستخدم
        </v-subheader>
      </v-row>

      <v-row dense class="px-5">
        <v-col dense cols="12" sm="6" md="4">
          <v-text-field
            v-model="searchName"
            label="اسم المستخدم"
            clearable
            prepend-icon="search"
            @keyup="searchData"
          ></v-text-field>
        </v-col>
        <v-col dense cols="12" sm="6" md="4">
          <v-text-field
            v-model="filterData.phoneNumber"
            label="رقم الهاتف"
            clearable
            prepend-icon="search"
            @keyup="searchData"
          ></v-text-field>
        </v-col>
        <v-col dense cols="12" sm="6" md="4">
          <v-text-field
            v-model="filterData.employeeNo"
            label="رقم الوظيفي"
            clearable
            prepend-icon="search"
            @keyup="searchData"
          ></v-text-field>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-if="hasPermassion(['AddUserOtherBranchs', 'AdminSystem'])"
        >
          <v-autocomplete
            v-model="selectedRegion"
            :items="regions"
            :loading="isLoadingRegion"
            single-line
            dense
            required
            :search-input.sync="searchRegion"
            item-text="regionName"
            item-value="bankRegionId"
            label="اختر المنطقة"
            placeholder="يجب إختيار المنطقة"
            return-object
            no-data-text="لايوجد بيانات"
            clearable
            @keyup="searchBranchRegion"
            @change="getBranchByRegionId"
            prepend-icon="mdi-map-marker"
          ></v-autocomplete>
        </v-col>
        <v-col
          cols="12"
          sm="6"
          md="4"
          v-if="hasPermassion(['AddUserOtherBranchs', 'AdminSystem'])"
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
            @change="searchData"
            prepend-icon="mdi-bank"
            dense
          ></v-autocomplete>
        </v-col>

        <v-col dense cols="12" sm="6" md="4">
          <v-select
            v-model="filterData.userType"
            :items="userTypes"
            item-text="name"
            item-value="id"
            clearable
            dense
            @change="searchData"
            prepend-icon="search"
            label="بحث عن طريق التبعية"
          >
          </v-select>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import { UserTypeStateList } from "../../../../models/enum";
import { mapActions } from "vuex";
export default {
  data: () => ({
    filterData: {
      name: null,
      userType: null,
      branchId: null,
      regionId: null,
      phoneNumber: null,
      employeeNo: null,
      pageNo: 1,
      pageSize: 30,
    },

    searchName: "",
    userTypes: UserTypeStateList,
    

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
  }),

  watch: {
    searchName(val) {
      this.filterData.name = val;
    },
    searchRegion(val) {
      if (this.isLoadingRegion) return;
      this.filterRegionData.regionName = val;
    },
    searchBranch(val) {
      this.filterBranchData.nameOrNumber = val;
    },
    selectedRegion(val) {
      if (!val) this.clearBranchData();
    },
  },

  computed: {},
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
      this.filterData.branchId=this.selectedBranch?.id;
      // this.filterData.userType=this.se?.id;
      this.$emit("search-data", this.filterData);
    },

    getBankRegions() {
      this.filterRegionData.bankId = null;
      try {
        this.isLoadingRegion = true;
        this.GetActiveBankRegions(this.filterRegionData)
          .then(() => {
            this.regions = [
              ...this.$store.getters["bankRegionStore/GET_ACTIVE_BANKREGIONS"],
            ];
            this.isLoadingRegion = false;
          })
          .catch((error) => {
            this.notify(`${error}`, "#1d262d");
            this.isLoadingRegion = false;
          });
      } catch (error) {
        this.isLoadingRegion = false;
        this.notify(error, "#1d262d");
      }
    },

    searchBranchRegion() {
      this.clearBranchData();
      this.getBankRegions();
    },

    clearRegionData() {
      this.isLoadingRegion = false;
      this.regions = [];
      this.selectedRegion = null;
      this.searchRegion = null;
      this.filterRegionData.bankId = null;
      this.filterRegionData.regionName = null;
    },

    getBranchs() {
      if (!this.selectedRegion) return;
      this.filterBranchData.branchRegionId = this.selectedRegion?.bankRegionId;
      this.isLoadingBranch = true;
      this.GetActiveBranchs(this.filterBranchData)
        .then(() => {
          this.branchs = [
            ...this.$store.getters["branchStore/GET_ACTIVE_BRANCHS"],
          ];
          this.isLoadingBranch = false;
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.isLoadingBranch = false;
        });
    },

    getBranchByRegionId() {
      this.getBranchs();
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
