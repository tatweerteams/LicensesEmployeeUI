<template>
  <div>
    <template v-if="itemDelete">
      <deleteComponent
        :deleteItemProp="itemDelete"
        @refresh-data-delete="initialize"
      ></deleteComponent>
    </template>
    <v-card
      min-height="40rem"
      color="transparent"
      elevation="0"
      height="auto"
      style="padding:30px; "
      shaped
    >
      <SearchComponent @search-data="searchData"></SearchComponent>
      <v-alert
        color="#C51162"
        type="info"
        elevation="5"
        class="mt-5"
        dense
        shaped
      >
        <p>
          <span class="font-weight-bold">ملاحظه : </span> سيتم إلغاء الطلب
          <span class="font-weight-bold">قيد الإدخال</span> خلال
          <span class="font-weight-bold">48 ساعة</span> من إنشاء الطلب
        </p>
      </v-alert>
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
              ><v-icon>mdi-newspaper-plus</v-icon> طلبات دفاتر جديدة
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>

            <v-spacer />

            <InsertOrUpdateComponent
              :updateItemProp="updateItem"
              @refresh-data="initialize"
            ></InsertOrUpdateComponent>
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
                <v-icon color="#fff">mdi-format-list-bulleted</v-icon>
              </v-btn>
            </template>
            <span>إدراج دفاتر للطلبية</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                :disabled="ValidateOrderRequestState(item)"
                fab
                class="mx-2"
                v-bind="attrs"
                v-on="on"
                color="#536DFE"
                @click="editItem(item)"
              >
                <v-icon color="#fff">mdi-text-box-edit</v-icon>
              </v-btn>
            </template>
            <span>تعديل بيانات الطلبية</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                :disabled="ValidateOrderRequestState(item)"
                fab
                v-bind="attrs"
                v-on="on"
                color="#E91D62"
                @click="deleteOrderRequest(item)"
              >
                <v-icon color="#fff">mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>إلغاء الطلبية</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.sendRequest`]="{ item }">
          <v-btn
            small
            :disabled="checkCandSendRequest(item)"
            class="white--text"
            color="#536DFE"
            @click="sendRequestItem(item)"
          >
            إرسال
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
import { EventBus } from "../../../eventBus";

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
  ValidateAccountCountWithMinBranchCountPublic,
  ValidateOrderRequestStatePublic,
  OrderRequestStateColorPublic,
} from "../../../models/mothedPublic.js";

import SearchComponent from "../Components/SearchOrderRequestComponent.vue";
import InsertOrUpdateComponent from "../Components/InsertOrUpdateComponent.vue";
import deleteComponent from "../Components/deleteOrderRequestComponent.vue";

export default {
  name: "LayoutsDemosBaselineFlipped",
  props: {
    source: String,
  },
  components: {
    SearchComponent,
    InsertOrUpdateComponent,
    deleteComponent,
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
        text: "عدد الدفاتر",
        value: "accountCount",
        sortable: false,
        align: "center",
      },
      {
        text: "الدفاتر المجمدة",
        value: "accountSuspendedCount",
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
        text: "الإجراءات",
        value: "action",
        sortable: false,
        align: "center",
      },
      {
        text: "إرسال طلبية",
        value: "sendRequest",
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

    updateItem: null,
    itemDelete: null,
  }),

  created() {
    this.initialize();

    EventBus.$on("refreshData", () => {
      this.initialize();
    });
    EventBus.$on("closeDialogUpdateOrderRequest", () => {
      this.updateItem = null;
    });

    EventBus.$on("closeDialogDeleteOrderRequest", () => {
      this.itemDelete = null;
    });
  },

  watch: {},

  computed: {
    ...mapFields("orderRequestStore", {
      grids: "grids",
      pageCount: "pageCount",
    }),
  },

  methods: {
    ...mapActions({
      GetOrderRequests: "orderRequestStore/GetOrderRequests",
      SendOrderRequest: "orderRequestStore/SendOrderRequest",
    }),
    getIncrement(item) {
      var index = this.grids.indexOf(item);
      var valuePage = (this.page - 1) * this.filterData.pageSize;
      return valuePage + index + 1;
    },

    checkCandSendRequest(item) {
      return (
        ValidateAccountCountWithMinBranchCountPublic(item) ||
        ValidateOrderRequestStatePublic(item)
      );
    },

    ValidateOrderRequestState(item) {
      return ValidateOrderRequestStatePublic(item);
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
        this.GetOrderRequests(this.filterData)
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

    deleteOrderRequest(item) {
      this.itemDelete = item;
    },

    editItem(item) {
      this.updateItem = item;
    },

    showOrderRequestItem(item) {
      let keyId = aesEncrypt(item.id);
      this.$router.push({ name: "OrderRequestItem", params: { id: keyId } });
    },

    sendRequestItem(item) {
      const sendItem = {
        orderRequestId: item.id,
      };

      try {
        this.$store.dispatch("loading", true);
        this.SendOrderRequest(sendItem)
          .then(() => {
            this.initialize();
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
