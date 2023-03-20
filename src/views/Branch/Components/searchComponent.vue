<template>
  <div>
    <v-card elevation="3" height="auto" class="px-5">
      <v-row>
        <v-subheader>
          <v-icon class="mx-2">search</v-icon>
          بحث علي الفروع المصرف
        </v-subheader>
      </v-row>

      <v-row dense class="px-5">
        <v-col dense cols="12" sm="6" md="4">
          <v-text-field
            v-model="searchName"
            label="اسم الفرع أو رقم"
            clearable
            prepend-icon="mdi-numeric"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6" md="4" v-if="hasPermassion(['AdminSystem'])">
          <v-autocomplete
            v-model="selectedBank"
            :items="banks"
            :loading="isLoading"
            single-line
            :search-input.sync="searchBank"
            item-text="name"
            item-value="bankId"
            label="المصرف"
            placeholder="بحث عن طريق المصرف"
            return-object
            no-data-text="قم بالبحث علي اسم المصرف"
            clearable
            prepend-icon="mdi-bank"
            @keyup="getBanks"
            @change="getRegionByBankId"
          ></v-autocomplete>
        </v-col>
        <v-col cols="12" sm="6" md="4" v-if="hasPermassion(['AdminSystem','AddBranchOtherRegions'])">
          <v-autocomplete
            v-model="selectedRegion"
            :items="regions"
            :loading="isLoadingRegion"
            single-line
            :search-input.sync="searchRegion"
            item-text="regionName"
            item-value="bankRegionId"
            label="اختر المنطقة"
            placeholder="بحث عن طريق المنطقة"
            return-object
            no-data-text="لايوجد بيانات"
            clearable
            @keyup="getBankRegions"
            prepend-icon="mdi-map-marker"
            @focus="getDataRegionWithFoucs"
          ></v-autocomplete>
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
// import { createHelpers } from "vuex-map-fields";
// const { mapFields } = createHelpers({
//   getterType: "getDataFields",
//   mutationType: "updateDataField",
// });

export default {
  data: () => ({
    filterData: {
      bankId: "",
      branchRegionId: "",
      nameOrNumber: "",
      pageNo: 1,
      pageSize: 30,
    },

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

    searchName: "",
  }),

  watch: {
    searchName(val) {
      this.filterData.nameOrNumber = val;
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
    filterIsSelected(val) {
      if (!val) this.searchData();
    },
  },

  computed: {
    // ...mapFields("bankRegionStore", {
    //   regions: "activeBankRegions",
    // }),
    // ...mapFields("bankStore", {
    //   banks: "grids",
    // }),

     
    filterIsSelected() {
      return (
        this.selectedBank || this.selectedRegion || this.filterData.nameOrNumber
      );
    },
  },
  methods: {
    ...mapActions({
      GetActiveBankRegions: "bankRegionStore/GetActiveBankRegions",
      GetBankStore: "bankStore/GetBanks",
    }),
    hasPermassion(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },

    getDataRegionWithFoucs() {
      if (this.regions.length > 0) return;
      this.getBankRegions();
    },

    searchData() {
      this.filterData.bankId = this.selectedBank?.bankId ?? null;
      this.filterData.branchRegionId =
        this.selectedRegion?.bankRegionId ?? null;
      this.$emit("search-data", this.filterData);
    },

    getRegionByBankId() {
      if(!this.selectedBank) return;
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
            // this.notify(`${error}`, "#1d262d");
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

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
