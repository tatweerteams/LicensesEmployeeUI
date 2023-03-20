<template>
  <div>
    <template v-if="itemDelete">
      <DeleteOrderItemComponent
        :deleteItemProp="itemDelete"
        @refresh-data-delete="initialize"
      ></DeleteOrderItemComponent>
    </template>
    <template v-if="updateOrderItem">
      <updateOrderItemComponent
        :updateItemProp="updateOrderItem"
        @refresh-data-update="initialize"
      ></updateOrderItemComponent>
    </template>
    <v-card
      min-height="40rem"
      color="transparent"
      elevation="0"
      height="auto"
      style="padding:30px; "
    >
      <SerachComponent @search-data="searchData"></SerachComponent>
      <v-btn class="my-5" @click="backPage" color="#03213d" elevation="0" text>
        <v-icon>mdi-arrow-right-thick</v-icon> رجوع للقائمة الطلبات
      </v-btn>
      <v-data-table
        :headers="headers"
        :disable-pagination="true"
        :items="grids"
        hide-default-footer
        class="elevation-5 pa-5"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title
              ><v-icon>mdi-newspaper-plus</v-icon> {{ titleOrder }}
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>

            <v-spacer />

            <InsertOrderItemComponent
              v-if="checkCanInsertAccount"
              :orderRequestIdProp="filterData.orderRequestId"
              @refresh-data="initialize"
            ></InsertOrderItemComponent>
          </v-toolbar>
        </template>

        <template v-slot:[`item.serialFrom`]="{ item }">
          <v-chip
            v-if="!item.serialFrom"
            small
            color="#E91D62"
            text-color="white"
          >
            لم يتم الإصدار
          </v-chip>
          <template v-else>
            {{ item.serialFrom }}
          </template>
        </template>

        <template v-slot:[`item.state`]="{ item }">
          <v-chip small color="#E91D62" text-color="white">
            {{ orderItemStateToText(item.state) }}
          </v-chip>
        </template>

        <template v-slot:[`item.countChekBook`]="{ item }">
          <v-chip small color="#081D38" text-color="white">
            {{ item.countChekBook }}
          </v-chip>
        </template>
        <template v-slot:[`item.increment`]="{ item }">
          {{ getIncrement(item) }}
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                :disabled="!checkCanInsertAccount"
                class="mx-2"
                fab
                v-bind="attrs"
                v-on="on"
                color="#536DFE"
                @click="editOrderItem(item)"
              >
                <v-icon color="#fff">mdi-text-box-edit</v-icon>
              </v-btn>
            </template>
            <span>تعديل عدد الدفاتر</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="!checkCanInsertAccount"
                x-small
                fab
                v-bind="attrs"
                v-on="on"
                color="#E91D62"
                @click="deleteOrderItem(item)"
              >
                <v-icon color="#fff">mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>إلغاء دفتر</span>
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
      <v-row class="my-5">
        <v-col cols="12" class="justify-center text-center">
          <v-btn
            @click="sendRequestItem"
            color="success"
            elevation="10"
            :disabled="checkCanSendRequest"
          >
            <v-icon>mdi-arrow-right-thick</v-icon> إرسال الطلبية
          </v-btn>
        </v-col>
      </v-row>

      <v-btn @click="backPage" color="#03213d" elevation="0" text>
        <v-icon>mdi-arrow-right-thick</v-icon> رجوع للقائمة الطلبات
      </v-btn>
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

import { aesDencrypt } from "../../../models/secretData.js";
import { EventBus } from "../../../eventBus.js";

import { OrderRequestState } from "../../../models/enum.js";
import {
  OrderRequestTypeToTextPublic,
  OrderItemStateToTextPublic,
  ValidateAccountCountWithMinBranchCountPublic,
  ValidateOrderRequestStatePublic,
} from "../../../models/mothedPublic.js";

import SerachComponent from "../components/searchComponent.vue";
import InsertOrderItemComponent from "../components/insertOrderItemComponent.vue";
import DeleteOrderItemComponent from "../components/deleteOrderItemComponent.vue";
import updateOrderItemComponent from "../components/updateOrderItemComponent.vue";
export default {
  components: {
    SerachComponent,
    InsertOrderItemComponent,
    DeleteOrderItemComponent,
    updateOrderItemComponent,
  },

  created() {
    this.filterData.orderRequestId = aesDencrypt(this.$route.params.id);
    this.initialize();

    EventBus.$on("closeDialogInsertOrderRequestItem", (isInsertData) => {
      if (isInsertData) this.initialize();
    });

    EventBus.$on("closeDeleteDialogOrderItem", () => {
      this.itemDelete = null;
    });

    EventBus.$on("closeDialogUpdateOrderItem", () => {
      this.updateOrderItem = null;
    });

    EventBus.$on("refreshDataOrderItem", () => {
      this.initialize();
    });
  },

  data: () => ({
    headers: [
      {
        text: "#",
        value: "increment",
        sortable: false,
        align: "center",
      },
      {
        text: "رقم الحساب",
        value: "accountNo",
        sortable: false,
        align: "center",
      },

      {
        text: "إسم صاحب الحساب",
        value: "accountName",
        sortable: false,
        align: "center",
      },

      {
        text: "رقم التسلسل",
        value: "serialFrom",
        sortable: false,
        align: "center",
      },

      {
        text: "حالة الطـلب",
        value: "state",
        sortable: false,
        align: "center",
      },
      {
        text: "كمية الدفاتر",
        value: "countChekBook",
        sortable: false,
        align: "center",
      },
      {
        text: "الإجراءات",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],

    page: 1,
    pageSize: 1,

    filterData: {
      orderRequestId: null,
      accounNoOrName: null,
      serialFrom: null,
      quentity: null,
      orderItemState: null,
      pageNo: 1,
      pageSize: 30,
    },

    itemDelete: null,
    updateOrderItem: null,
  }),

  computed: {
    ...mapFields("orderItemStore", {
      grids: "orderItems",
      orderRequest: "orderRequest",
      pageCount: "pageCount",
    }),

    

    titleOrder() {
      return `بيانات الطلبية  ${OrderRequestTypeToTextPublic(
        this.orderRequest?.orderRequestType
      )} ${this.orderRequest?.branchName ?? ""}`;
    },

    checkCanInsertAccount() {
      return this.orderRequest?.orderRequestState == OrderRequestState.Process;
    },
    checkCanSendRequest() {
      return (
        ValidateAccountCountWithMinBranchCountPublic(this.orderRequest) ||
        ValidateOrderRequestStatePublic(this.orderRequest)
      );
    },
  },

  methods: {
    getIncrement(item)
    {
      var index= this.grids.indexOf(item);
      var valuePage= (this.page-1) * this.filterData.pageSize;
      return valuePage + index + 1 ;
    },
    backPage() {
      this.$router.back();
    },

    ...mapActions({
      GetOrderItems: "orderItemStore/GetOrderItems",
      SendOrderRequest: "orderRequestStore/SendOrderRequest",
    }),

    initialize() {
      try {
        this.filterData.pageNo = this.page;
        this.$store.dispatch("loading", true);
        this.GetOrderItems(this.filterData)
          .then(() => {
            this.$store.dispatch("loading", false);
            this.pageSize = this.pageCount;
          })
          .catch((error) => {
            this.$store.dispatch("loading", false);
            this.notify(`${error}`, "#1d262d");
          });
      } catch (error) {
        this.$store.dispatch("loading", false);
        this.notify(error, "#1d262d");
      }
    },

    sendRequestItem() {
      const sendItem = {
        orderRequestId: this.filterData.orderRequestId,
      };
      try {
        this.$store.dispatch("loading", true);
        this.SendOrderRequest(sendItem)
          .then((res) => {
            this.notify(`${res}`, "#1d262d");
            this.backPage();
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

    searchData(filter) {
      this.page = 1;

      this.filterData.accounNoOrName = filter.accounNoOrName;
      this.filterData.serialFrom = filter.serialFrom;
      this.filterData.quentity = filter.quentity;
      this.filterData.requestState = filter.requestState;

      this.initialize();
    },

    onPaginationClick(page) {
      this.page = page;
      this.initialize();
    },

    orderItemStateToText(item) {
      return OrderItemStateToTextPublic(item);
    },

  

    deleteOrderItem(item) {
      this.itemDelete = item;
    },

    editOrderItem(item) {
      this.updateOrderItem = item;
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },

  watch: {},
};
</script>

<style></style>
