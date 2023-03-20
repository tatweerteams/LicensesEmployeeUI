<template>
  <div>
    <v-card elevation="3" height="auto" class="px-5">
      <v-row>
        <v-subheader>
          <v-icon class="mx-2">search</v-icon>
          بحث عن صلاحية
        </v-subheader>
      </v-row>

      <v-row dense class="px-5">
        <v-col dense cols="12" sm="6" md="4">
          <v-text-field
            v-model="searchName"
            label="اسم الدور"
            clearable
            prepend-icon="search"
            @keyup="searchData"
          ></v-text-field>
        </v-col>
        <v-col dense cols="12" sm="6" md="4">
          <v-select
            v-model="filterData.userType"
            :items="userTypes"
            item-text="name"
            item-value="id"
            clearable
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
export default {
  data: () => ({
    filterData: {
      name: null,
      userType: null,
      pageNo: 1,
      pageSize: 30,
    },

    searchName: "",
    userTypes: UserTypeStateList,
  }),

  watch: {
    searchName(val) {
      this.filterData.name = val;
    },
  },

  computed: {},
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
