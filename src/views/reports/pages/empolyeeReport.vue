<template>
  <div>
    <template v-if="rejectNoteItem">
      <RejectNoteComponent
        :noteRejectItemProp="rejectNoteItem"
        @close-dialog="CloseDialogReject"
      >
      </RejectNoteComponent>
    </template>
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
              ><v-icon>mdi-newspaper-plus</v-icon>    تقرير الموظفين
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

        <template v-slot:[`item.orderRequestState`]="{ item }">
          <v-chip
            small
            :color="orderRequestStateColor(item.orderRequestState)"
            text-color="white"
          >
            {{ orderRequestStateToText(item.orderRequestState) }}
          </v-chip>
        </template>

        <template v-slot:[`item.rejectNote`]="{ item }">
          <v-btn
            x-small
            fab
            color="#536DFE"
            @click="showRejectNotes(item)"
            v-if="item.orderRequestNote"
          >
            <v-icon color="#fff">mdi-television-guide</v-icon>
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

import {
  OrderRequestTypeToTextPublic,
  OrderRequestStateToTextPublic,
  ChangeColorOrderRequestTypePublic,
  OrderRequestStateColorPublic,
} from "../../../models/mothedPublic.js";

import SearchComponent from "../components/searchEmployeeReportComponent.vue";
import RejectNoteComponent from "../components/rejectAccountNoteComponent.vue";
export default {
  name: "LayoutsDemosBaselineFlipped",
  props: {
    source: String,
  },
  components: {
    SearchComponent,
    RejectNoteComponent,
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
        text: "رقم الوظيفي",
        value: "employeeNo",
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
        text: "تاريخ إصدار الطلب",
        value: "requestDate",
        sortable: false,
        align: "center",
      },
      {
        text: "تاريخ العملية",
        value: "orderCreationDate",
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
        text: "عرض سبب الرفض",
        value: "rejectNote",
        sortable: false,
        align: "center",
      },
    ],

    page: 1,
    pageSize: 1,

    filterData: {
      branchId: null,
      employeeNo: null,
      from: null,
      to: null,
      pageNo: 1,
      pageSize: 30,
    },

    rejectNoteItem: null,
  }),

  created() {
     this.initialize();
  },

  computed: {
    ...mapFields("employeeReportStore", {
      grids: "grids",
      pageCount: "pageCount",
    }),
  },

  methods: {
    ...mapActions({
        GetEmpolyeeReport:
        "employeeReportStore/GetEmpolyeeReport",
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

    CloseDialogReject() {
      this.rejectNoteItem = null;
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
        this.filterData.pageNo=this.page;
        this.$store.dispatch("loading", true);
        this.GetEmpolyeeReport(this.filterData)
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

    showRejectNotes(item) {
      this.rejectNoteItem = item;
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
