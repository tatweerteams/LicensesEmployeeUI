<template>
  <div>
    <v-card elevation="3" height="auto" class="px-5">
      <v-row>
        <v-subheader>
          <v-icon class="mx-2">search</v-icon>
          بحث علي بيانات في الطلبية
        </v-subheader>
      </v-row>

      <v-row dense class="px-5">
        <v-col dense cols="12" sm="6" md="4">
          <v-text-field
            v-model="filterData.accounNoOrName"
            label="رقم الحساب أو إسم الحساب"
            clearable
            dense
            prepend-icon="mdi-ticket-confirmation"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="filterData.serialFrom"
            label="بحث عن طريق رقم التسلسل"
            clearable
            dense
            prepend-icon="mdi-ticket-confirmation"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="filterData.quentity"
            label="بحث عن طريق الكمية"
            clearable
            dense
            prepend-icon="mdi-ticket-confirmation"
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="filterData.orderItemState"
            :items="enumModel.OrderorderItemStateList"
            label="بحث عن  حالة الحساب"
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
 

import * as enums from "../../../models/enum.js";

export default {

  name: "Serach-compnent",

  
  data: () => ({
    filterData: {
      accounNoOrName: null,
      serialFrom: null,
      quentity: null,
      orderItemState: null,
      pageNo: 1,
      pageSize: 30,
    },

    enumModel: enums,
  }),

  watch: {
    

    filterIsSelected(val) {
      if (!val) this.searchData();
    },
  },

  computed: {
    filterIsSelected() {
      return (
        this.filterData.accounNoOrName ||
        this.filterData.serialFrom ||
        this.filterData.orderItemState ||
        this.filterData.quentity
      );
    },
  },
  methods: {
    searchData() {
      this.$emit("search-data", this.filterData);
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
