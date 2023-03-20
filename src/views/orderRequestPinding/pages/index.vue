<template>
  <div>
    <v-card
      min-height="40rem"
      color="transparent"
      elevation="0"
      height="auto"
      style="padding:30px; "
    >
      <SearchComponent
        :otherProcess="true"
        @search-data="searchData"
      ></SearchComponent>
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
              ><v-icon>mdi-newspaper-plus</v-icon> قائمة الطلبات المرسلة من
              الفرع
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer />
          </v-toolbar>
        </template>

        <template v-slot:[`item.identityNumber`]="{ item }">
          <v-chip
            small
            :color="orderRequestStateColor(item.orderRequestState)"
            text-color="white"
          >
            <span v-if="item.identityNumber">{{ item.identityNumber }}</span>
            <span v-else>لايوجد رقم إشاري</span>
          </v-chip>
        </template>

        <template v-slot:[`item.orderRequestType`]="{ item }">
          <v-chip
            small
            :color="changeColorOrderRequestType(item.orderRequestType)"
            text-color="white"
          >
            {{ OrderRequestTypeToText(item.orderRequestType) }}
          </v-chip>
        </template>

        <template v-slot:[`item.orderRequestState`]="{ item }">
          <v-chip
            small
            :color="orderRequestStateColor(item.orderRequestState)"
            text-color="white"
          >
            {{ orderRequestStateToText(item.orderRequestState) }}
          </v-chip>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-btn
            x-small
            fab
            color="#536DFE"
            @click="showOrderRequestItem(item)"
          >
            <v-icon color="#fff">mdi-format-list-bulleted</v-icon>
          </v-btn>
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

import { aesEncrypt } from "../../../models/secretData.js";
import {
  OrderRequestTypeToTextPublic,
  OrderRequestStateToTextPublic,
  ChangeColorOrderRequestTypePublic,
  OrderRequestStateColorPublic,
} from "../../../models/mothedPublic.js";

import SearchComponent from "../../OrderRequest/Components/SearchOrderRequestComponent.vue";

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
        text: "رقم الإشاري",
        value: "identityNumber",
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
        text: "تاريخ الطلب",
        value: "requestDate",
        sortable: false,
        align: "center",
      },

      {
        text: "نوع الطلب",
        value: "orderRequestType",
        sortable: false,
        align: "center",
      },

      {
        text: "عدد الحسابات",
        value: "accountCount",
        sortable: false,
        align: "center",
      },

      {
        text: "حالة الطلب",
        value: "orderRequestState",
        sortable: false,
        align: "center",
      },

      {
        text: "عرض القائمة",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],

    page: 1,
    pageSize: 1,

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
  }),

  created() {
    this.initialize();
  },

  watch: {},

  computed: {
    ...mapFields("orderRequestPindingStore", {
      grids: "grids",
      pageCount: "pageCount",
    }),
  },

  methods: {
    ...mapActions({
      GetOrderRequestPinddings:
        "orderRequestPindingStore/GetOrderRequestPinddings",
    }),

    getIncrement(item) {
      var index = this.grids.indexOf(item);
      var valuePage = (this.page - 1) * this.filterData.pageSize;
      return valuePage + index + 1;
    },


    changeColorOrderRequestType(orderRequestType) {
      return ChangeColorOrderRequestTypePublic(orderRequestType);
    },

    orderRequestStateColor(orderRequestState) {
      return OrderRequestStateColorPublic(orderRequestState);
    },

    OrderRequestTypeToText(orderRequestType) {
      return OrderRequestTypeToTextPublic(orderRequestType);
    },

    orderRequestStateToText(orderRequestState) {
      return OrderRequestStateToTextPublic(orderRequestState);
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
        this.GetOrderRequestPinddings(this.filterData)
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

    showOrderRequestItem(item) {
      let keyId = aesEncrypt(item.id);
      this.$router.push({
        name: "OrderRequestPindingItem",
        params: { id: keyId },
      });
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
