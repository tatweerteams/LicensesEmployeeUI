<template>
  <div>
    <template v-if="approvedItem">
      <ApprovedOrderItemComponent
        :approvedItemProp="approvedItem"
        @refresh-data="refreshDataComponent"
        @close-dialog="closeDialogComponent"
      ></ApprovedOrderItemComponent>
    </template>
    <template v-if="updateOrderItem">
      <updateOrderItemComponent
        :updateItemProp="updateOrderItem"
        @refresh-data-update="initialize"
      ></updateOrderItemComponent>
    </template>

    <template v-if="rejectItem">
      <RejectOrderItemComponent
        :rejectRequestItemProp="rejectItem"
        @refresh-data="refreshDataComponent"
        @close-dialog="closeDialogComponent"
      ></RejectOrderItemComponent>
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
        <template v-slot:[`item.increment`]="{ item }">
          {{ getIncrement(item) }}
        </template>
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title
              ><v-icon>mdi-newspaper-plus</v-icon> {{ titleOrder }}
            </v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>

            <v-spacer />
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
          <v-chip
            small
            :color="item.state == orderItemState.Success ? '#E91D62' : 'red'"
            text-color="white"
          >
            {{ orderItemStateToText(item.state) }}
          </v-chip>
        </template>

        <template v-slot:[`item.countChekBook`]="{ item }">
          <v-chip small color="#081D38" text-color="white">
            {{ item.countChekBook }}
          </v-chip>
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-btn
            x-small
            class="mx-2"
            fab
            color="#536DFE"
            :disabled="!checkIsPinding"
            @click="editOrderItem(item)"
          >
            <v-icon color="#fff">mdi-text-box-edit</v-icon>
          </v-btn>
        </template>

        <template v-slot:[`item.activation`]="{ item }">
          <v-switch
            dense
            color="#E91D62"
            hide-details
            class="justify-center text-center mr-4 mb-4 d-inline-block"
            :input-value="item.state == orderItemState.Success"
            @click="activationItem(item)"
            :disabled="!checkIsPinding"
          ></v-switch>
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
          ></v-pagination>
        </div>
      </template>
      <v-row class="my-5" v-if="checkIsPinding">
        <v-col cols="12" class="justify-center text-center">
          <v-btn
            @click="approvedOrderRequest"
            color="#536DFE"
            class="white--text"
            elevation="10"
            v-if="hasPermassion(['ApprovidRequest', 'AdminSystem'])"
          >
            <v-icon>mdi-arrow-right-thick</v-icon> قبول الطلب
          </v-btn>
          <v-btn
            class="mx-5 white--text"
            @click="rejectOrderRequest"
            color="red"
            elevation="10"
            v-if="hasPermassion(['RejectRequest', 'AdminSystem'])"
          >
            <v-icon>mdi-arrow-right-thick</v-icon> رفض الطلب
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
const { mapFields, mapMultiRowFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

import { aesDencrypt } from "../../../models/secretData.js";
import { EventBus } from "../../../eventBus.js";

import { OrderItemState, OrderRequestState } from "../../../models/enum.js";
import {
  OrderRequestTypeToTextPublic,
  OrderItemStateToTextPublic,
} from "../../../models/mothedPublic.js";

import SerachComponent from "../../OrderRequestItem/components/searchComponent.vue";

import ApprovedOrderItemComponent from "../components/approvedOrderRequestComponent.vue";
import RejectOrderItemComponent from "../components/rejectOrderRequestComponent.vue";
import UpdateOrderItemComponent from "../../OrderRequestItem/components/updateOrderItemComponent.vue";

export default {
  components: {
    SerachComponent,
    ApprovedOrderItemComponent,
    RejectOrderItemComponent,
    UpdateOrderItemComponent,
  },

  created() {
    this.filterData.orderRequestId = aesDencrypt(this.$route.params.id);
    this.initialize();

    EventBus.$on("refreshDataOrderItem", () => {
      this.initialize();
    });

    EventBus.$on("closeDialogUpdateOrderItem", () => {
      this.updateOrderItem = null;
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
        text: "تعديل الطلبية",
        value: "action",
        sortable: false,
        align: "center",
      },
      {
        text: "تجميد / مقبول",
        value: "activation",
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

    updateOrderItem: null,
    approvedItem: null,
    rejectItem: null,

    orderItemState: OrderItemState,
  }),

  computed: {
    ...mapFields("orderItemStore", {
      orderRequest: "orderRequest",
      pageCount: "pageCount",
    }),

    ...mapMultiRowFields("orderItemStore", {
      grids: "orderItems",
    }),

    titleOrder() {
      return `بيانات الطلبية  ${OrderRequestTypeToTextPublic(
        this.orderRequest?.orderRequestType
      )} ${this.orderRequest?.branchName ?? ""}`;
    },

    checkIsPinding() {
      return this.orderRequest?.orderRequestState == OrderRequestState.Pinding;
      // return (
      //   this.orderRequest?.orderRequestState == OrderRequestState.RejectRequest ||
      //   this.orderRequest?.orderRequestState == OrderRequestState.IsFrozen ||
      //   this.orderRequest?.orderRequestState == OrderRequestState.IsRejectedByCenter
      // );
    },
  },

  methods: {
    hasPermassion(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },
    getIncrement(item) {
      var index = this.grids.indexOf(item);
      var valuePage = (this.page - 1) * this.filterData.pageSize;
      return valuePage + index + 1;
    },
    backPage() {
      this.$router.back();
    },

    refreshDataComponent() {
      this.approvedItem = null;
      this.backPage();
    },

    closeDialogComponent() {
      this.approvedItem = null;
      this.rejectItem = null;
    },

    ...mapActions({
      GetOrderItems: "orderItemStore/GetOrderItems",
      ChangeItemState: "orderPindingItemStore/ChangeItemState",
    }),

    initialize() {
      try {
        this.filterData.pageNo=this.page;
        this.$store.dispatch("loading", true);
        this.GetOrderItems(this.filterData)
          .then(() => {
            this.$store.dispatch("loading", false);
            this.pageSize = this.pageCount;
            console.log(this.orderRequest);
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

    approvedOrderRequest() {
      const sendItem = {
        orderRequestId: this.filterData.orderRequestId,
      };

      this.approvedItem = sendItem;
    },

    rejectOrderRequest() {
      const sendItem = {
        orderRequestId: this.filterData.orderRequestId,
      };
      this.rejectItem = sendItem;
    },

    searchData(filter) {
      this.page = 1;

      this.filterData.accounNoOrName = filter.accounNoOrName;
      this.filterData.serialFrom = filter.serialFrom;
      this.filterData.quentity = filter.quentity;
      this.filterData.requestState = filter.requestState;
      this.filterData.pageNo = filter.pageNo;
      this.filterData.pageSize = filter.pageSize;

      this.initialize();
    },

    onPaginationClick(page) {
      this.page = page;
      this.initialize();
    },

    orderItemStateToText(item) {
      return OrderItemStateToTextPublic(item);
    },

    editOrderItem(item) {
      this.updateOrderItem = item;
    },

    activationItem(item) {
      const editItme = {
        orderItemId: item.id,
      };
      this.$store.dispatch("loading", true);
      try {
        this.$store.dispatch("loading", true);
        this.ChangeItemState(editItme)
          .then((res) => {
            this.notify(`${res}`, "#1d262d");
            item.state =
              item.state == this.orderItemState.Success
                ? this.orderItemState.IsSuspended
                : this.orderItemState.Success;
            this.$store.dispatch("loading", false);
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

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },

  watch: {},
};
</script>

<style></style>
