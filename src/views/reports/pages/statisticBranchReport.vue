<template>
  <div>
    <v-card
      min-height="40rem"
      color="transparent"
      elevation="0"
      height="auto"
      style="padding:30px; "
    >
      <SearchComponent @search-data="searchData"></SearchComponent>
      <v-data-table
        :headers="headers"
        :disable-pagination="true"
        :items="grids"
        hide-default-footer
        class="elevation-5 pa-5"
      >
        <template v-slot:[`item.increment`]="{ item }">
          {{ getIncrement(item) }}
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title
              ><v-icon>mdi-newspaper-plus</v-icon> إحصائية طلبات الفروع
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer />
          </v-toolbar>
        </template>

        <template v-slot:no-data>
          <v-btn color="#081D38" class="white--text" @click="initialize"
            >عرض البيانات</v-btn
          >
        </template>
      </v-data-table>

      <template class="mt-5">
        <div class="text-center mt-3">
          <v-pagination
            v-model="page"
            :length="pageSize"
            circle
            color="#081D38"
            @input="onPaginationClick"
            :total-visible="7"
          ></v-pagination>
        </div>
      </template>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

import SearchComponent from "../components/searchStatisticBranchComponent.vue";
export default {
  name: "LayoutsDemosBaselineFlipped",
  props: {
    source: String,
  },
  components: {
    SearchComponent,
  },

  data: () => ({
    userPermasstion: [],
    headers: [
      {
        text: "#",
        value: "increment",
        sortable: false,
        align: "center",
      },
      {
        text: "رقم الفرع",
        value: "branchNumber",
        sortable: false,
        align: "center",
      },

      {
        text: "الفرع",
        value: "branchName",
        sortable: false,
        align: "center",
      },
      {
        text: "المنظقة",
        value: "regionName",
        sortable: false,
        align: "center",
      },
      {
        text: "إجمالي الطلبات",
        value: "orderRequestCount",
        sortable: false,
        align: "center",
      },
      {
        text: "إجمالي الحسابات",
        value: "accountCount",
        sortable: false,
        align: "center",
      },
      {
        text: "إجمالي طلبات شركات",
        value: "orderRequestCompanyCount",
        sortable: false,
        align: "center",
      },
      {
        text: "إجمالي طلبات أفراد",
        value: "orderRequestIndividualCount",
        sortable: false,
        align: "center",
      },
    ],

    page: 1,
    pageSize: 1,

    filterData: {
      nameOrNumber: null,
      bankId: null,
      pageNo: 1,
      pageSize: 30,
    },
  }),

  created() {
    this.initialize();
  },

  computed: {
    ...mapFields("statisticBranchReportStore", {
      grids: "grids",
      pageCount: "pageCount",
    }),
  },

  methods: {
    ...mapActions({
      GetStatisticBranchReport:
        "statisticBranchReportStore/GetStatisticBranchReport",
    }),
    getIncrement(item) {
      var index = this.grids.indexOf(item);
      var valuePage = (this.page - 1) * this.filterData.pageSize;
      return valuePage + index + 1;
    },

    searchData(filter) {
      this.page = 1;
      this.filterData = filter;

      this.initialize();
    },

    hasPermassion(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },

    initialize() {
      try {
        this.filterData.pageNo = this.page;
        this.$store.dispatch("loading", true);
        this.GetStatisticBranchReport(this.filterData)
          .then(() => {
            this.$store.dispatch("loading", false);
            this.pageSize = this.pageCount;
          })
          .catch((error) => {
            this.notify(`${error}`, "#1d262d");
            this.$store.dispatch("loading", false);
          });
      } catch (error) {
        this.$store.dispatch("loading", false);
        this.notify(error, "#1d262d");
      }
    },

    onPaginationClick(page) {
      this.page = page;
      this.initialize();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style scoped>
/* delete and edit icon disable color */
.theme--dark.v-icon--disabled {
  color: rgba(221, 59, 59, 0.5) !important;
}

/* Activate icon disable color */
.theme--light.v-icon--disabled {
  color: rgba(221, 59, 59, 0.5) !important;
}</style
>>
