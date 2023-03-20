<template>
  <div>
    <v-card elevation="3" height="auto" class="px-5">
      <v-row>
        <v-subheader>
          <v-icon class="mx-2">search</v-icon>
          بحث عن فرع
        </v-subheader>
      </v-row>
      <v-form ref="formSearch" v-model="valid">
        <v-row dense class="px-5">
          <v-col dense cols="12" sm="6" md="4">
            <v-text-field
              v-model="searchName"
              label="رقم أو إسم الفرع"
              clearable
              :rules="
                searchName
                  ? [validationInput.isEmpty, validationInput.numberAndArabic]
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
            ></v-autocomplete>
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
  props: {},
  data: () => ({
    menu1: false,
    menu2: false,
    valid: false,
    validationInput: validationInput,

    filterData: {
      nameOrNumber: null,
      bankId: null,
      pageNo: 1,
      pageSize: 30,
    },

    defaultFilterData: {
      nameOrNumber: null,
      bankId: null,
      pageNo: 1,
      pageSize: 30,
    },

    enumModel: enums,

    isSearchData: false,

    isLoading: false,
    selectedBank: null,
    searchBank: null,
    filterBankData: {
      bankName: null,
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
  },

  computed: {
    filterIsSelected() {
      if (this.filterData.nameOrNumber || this.selectedBank) return true;
      else return false;
    },

    ...mapFields("bankStore", {
      banks: "grids",
    }),
  },
  methods: {
    ...mapActions({
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
     
      this.filterData.bankId = this.selectedBank?.bankId ?? null;

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
      this.clearBankData();
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

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
