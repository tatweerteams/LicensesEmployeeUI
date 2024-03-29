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
              ><v-icon>mdi-newspaper-plus</v-icon> تقرير طلبات الفرع
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
            <span v-else>لم يتم الإصدار</span>
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
        <template v-slot:[`item.inputType`]="{ item }">
          <v-chip small color="#536dfe" text-color="white">
            {{ InputTypeToText(item.inputType) }}
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

        <template v-slot:[`item.orderItem`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                fab
                v-bind="attrs"
                v-on="on"
                color="#536DFE"
                @click="showOrderRequestItem(item)"
              >
                <v-icon color="#fff">mdi-television-guide</v-icon>
              </v-btn>
            </template>
            <span>عرض قائمة الدفاتر داخل الطلبية</span>
          </v-tooltip>
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
import { aesEncrypt } from "../../../models/secretData.js";
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
  InputTypeToTextPublic,
} from "../../../models/mothedPublic.js";

import SearchComponent from "../components/searchBranhcReportComponent.vue";
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
        text: "الإشاري",
        value: "identityNumber",
        sortable: false,
        align: "center",
      },

      // {
      //   text: "رقم الفرع",
      //   value: "branchNumber",
      //   sortable: false,
      //   align: "center",
      // },
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
        text: "حالة الطلب",
        value: "orderRequestState",
        sortable: false,
        align: "center",
      },
      {
        text: "طريقة الطلب",
        value: "inputType",
        sortable: false,
        align: "center",
      },
      {
        text: "الموظف",
        value: "employeeNo",
        sortable: false,
        align: "center",
      },
      {
        text: "عدد الدفاتر",
        value: "countChekBook",
        sortable: false,
        align: "center",
      },
      {
        text: "سبب الرفض",
        value: "rejectNote",
        sortable: false,
        align: "center",
      },
      {
        text: "تفاصيل",
        value: "orderItem",
        sortable: false,
        align: "center",
      },
    ],

    page: 1,
    pageSize: 1,

    filterData: {
      branchId: null,
      identityNo: null,
      orderRequestState: null,
      orderRequestType: null,
      inputType: null,
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
    ...mapFields("branchOrderReportStore", {
      grids: "grids",
      pageCount: "pageCount",
    }),
  },

  methods: {
    ...mapActions({
      GetBranchReport: "branchOrderReportStore/GetBranchReport",
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
    InputTypeToText(inputType) {
      return InputTypeToTextPublic(inputType);
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
        this.filterData.pageNo = this.page;
        this.$store.dispatch("loading", true);
        this.GetBranchReport(this.filterData)
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
    showOrderRequestItem(item) {
      let keyId = aesEncrypt(item.orderRequestId);

      this.$router.push({
        name: "OrderRequestPindingItem",
        params: { id: keyId },
      });
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
