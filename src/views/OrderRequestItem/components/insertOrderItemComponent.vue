<template>
  <v-dialog
    v-model="dialog"
    max-width="1100px"
    persistent
    :overlay-opacity="1"
    overlay-color="#081D38"
    scrollable
  >
    <template v-slot:activator="{ on }">
      <template>
        <v-btn
          color="#536DFE"
          class="white--text"
          @click="openDialog"
          v-on="on"
          elevation="5"
        >
          <v-icon class="ml-2">mdi-plus-circle</v-icon
          ><span>إضافة حساب للقائمة</span>
        </v-btn>
      </template>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
        <v-spacer />
        <v-btn class="mr-2" @click="close" outlined color="error">
          <v-icon style="font-size: 19px" dark>clear</v-icon>
        </v-btn>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                prepend-icon="mdi-ticket-confirmation"
                v-model="searchNameOrNumber"
                dense
                label="بحث عن طريق رقم الحساب أو الإسم"
                maxLength="50"
                @keyup="getAccounts"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :disable-pagination="true"
            :items="accounts"
            hide-default-footer
            class="elevation-5 pa-5"
          >
            <template v-slot:[`item.individualRequestAccountDay`]="{ item }">
              <v-chip small color="#E91D62" text-color="white">
                {{
                  IndividualRequestAccountDayToText(
                    item.individualRequestAccountDay
                  )
                }}
              </v-chip>
            </template>

            <template v-slot:[`item.requestQuantity`]="{ item }">
              <v-chip
                v-if="item.requestQuantity == null"
                small
                color="#E91D62"
                text-color="white"
              >
                طلب غير محدد
              </v-chip>
              <v-chip v-else small color="#081D38" text-color="white">
                {{ item.requestQuantity }}
              </v-chip>
            </template>

            <template v-slot:[`item.countChekBook`]="{ item }">
              <v-text-field
                v-model.number="item.countChekBook"
                dense
                maxLength="2"
                append-outer-icon="mdi-minus-circle"
                hide-details
                :rules="[
                  validationInput.numberOnly,
                  validationInput.numberNotZero,
                ]"
                @keydown="isNumber"
                prepend-icon="mdi-plus-circle"
                :readonly="item.isInsert"
                @click:append-outer="minusQuentity(item)"
                @click:prepend="addQuentity(item)"
              ></v-text-field>
            </template>

            <template v-slot:[`item.action`]="{ item }">
              <v-tooltip bottom v-if="!item.isInsert">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    x-small
                    fab
                    v-bind="attrs"
                    v-on="on"
                    color="#081D38"
                    @click="insertAccountItem(item)"
                    :loading="loadingInsert"
                    :disabled="loadingInsert"
                  >
                    <v-icon size="30" color="#fff">mdi-plus-circle</v-icon>
                  </v-btn>
                </template>
                <span>إضافة للطلبية</span>
              </v-tooltip>

              <v-tooltip bottom v-else>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn x-small v-bind="attrs" v-on="on" icon>
                    <v-icon size="30" color="#081D38">mdi-check-bold</v-icon>
                  </v-btn>
                </template>
                <span>تم إضافة للطلبية</span>
              </v-tooltip>
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
        </v-container>
      </v-card-text>

      <!-- <v-card-actions>
        <div style="width: 100%;text-align: center;">
          <v-btn class="mx-2 white--text" @click="close" color="#E91D62">
            <v-icon dark>clear</v-icon>
            <span>إلغاء</span>
          </v-btn>
        </div>
      </v-card-actions> -->
    </v-card>
  </v-dialog>
</template>

<script>
// import { EventBus } from "../../../eventBus.js";
import { mapActions } from "vuex";

import { createHelpers } from "vuex-map-fields";
const { mapFields, mapMultiRowFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

import { validationInput } from "../../../models/validationInput.js";
import * as enums from "../../../models/enum.js";
export default {
  name: "insert-OrderRequestItem",
  props: {
    orderRequestIdProp: null,
  },
  components: {},

  data: () => ({
    dialog: false,
    valid: false,
    validationInput: validationInput,
    enumModel: enums,
    // accounts: [],
    headers: [
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
        text: "طلب في اليوم",
        value: "individualRequestAccountDay",
        sortable: false,
        align: "center",
      },
      {
        text: "عدد الدفاتر في اليوم",
        value: "requestQuantity",
        sortable: false,
        align: "center",
      },
      {
        text: "الكمية",
        value: "countChekBook",
        sortable: false,
        align: "center",
        width: 180,
      },
      {
        text: "إضافــة",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],

    loadingInsert: false,
    isInsertData: false,

    searchNameOrNumber: null,
    filterData: {
      orderRequestId: null,
      accounNoOrName: null,
      pageNo: 1,
      pageSize: 30,
    },

    page: 1,
    pageSize: 1,
  }),

  computed: {
    formTitle() {
      return "إضافة حساب للطلبية";
    },
    ...mapFields("insertAccountOrderItemStore", {
      pageCount: "pageCount",
    }),
    ...mapMultiRowFields("insertAccountOrderItemStore", {
      accounts: "accountWithOutOrderItem",
    }),
  },

  watch: {
    orderRequestIdProp: {
      handler(data) {
        this.filterData.orderRequestId = data;
      },
      immediate: true,
    },
    searchNameOrNumber(data) {
      this.filterData.accounNoOrName = data;
    },
  },
  methods: {
    ...mapActions({
      GetAccountWithOutOrderItem:
        "insertAccountOrderItemStore/GetAccountWithOutOrderItem",
      InsertOrderItemRequest:
        "insertAccountOrderItemStore/InsertOrderItemRequest",
    }),
    openDialog() {
      this.dialog = true;
      this.getAccounts();
    },

    IndividualRequestAccountDayToText(IndividualRequestAccountDay) {
      let messge = "طلب غير محدد";
      switch (IndividualRequestAccountDay) {
        case true:
          messge = "طلب غير محدد";
          break;
        case false:
          messge = "طلب مرة في اليوم";
          break;
        default:
          break;
      }
      return messge;
    },

    getAccounts() {
      this.filterData.pageNo = this.page;
      this.$store.dispatch("loading", true);
      this.GetAccountWithOutOrderItem(this.filterData)
        .then(() => {
          this.$store.dispatch("loading", false);
          this.pageSize = this.pageCount;
        })
        .catch((error) => {
          this.$store.dispatch("loading", false);
          this.notify(`${error}`, "#1d262d");
        });
    },

    isNumber(evt) {
      if (evt.keyCode == 8) return true;

      var result = this.checkIsNumber(evt.key);
      if (!result) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    checkIsNumber(number) {
      return /^[0-9]*$/.test(number);
    },

    close() {
      setTimeout(() => {}, 300);

      // if(this.isInsertData)
      // {
      //   console.log('d')
      //   EventBus.$emit("refreshDataOrderItem");
      // }
      this.dialog = false;
      this.page = 1;
      this.isInsertData = false;
    },

    insertAccountItem(item) {
      if (!item.countChekBook) return;

      if (
        item.requestQuantity != null &&
        parseInt(item.countChekBook) > parseInt(item.requestQuantity)
      ) {
        let message = "لايمكن إجتياز الحد الأعلي لعدد الدفاتر في اليوم ";
        this.notify(`${message}`, "#1d262d");
        return;
      }

      let orderItem = {
        accountId: item.accountId,
        accountNo: item.accountNo,
        accountName: item.accountName,
        countChekBook: item.countChekBook,
        orderRequestId: this.filterData.orderRequestId,
      };
      this.isInsertData = true; // check IsInsertData And Refeach DataGrid
      this.loadingInsert = true;

      this.InsertOrderItemRequest(orderItem)
        .then((res) => {
          item.isInsert = true;
          this.loadingInsert = false;
          this.$emit("refresh-data");
          this.notify(`${res}`, "#1d262d");
        })
        .catch((error) => {
          this.$store.dispatch("loading", false);
          this.notify(`${error}`, "#1d262d");
          this.loadingInsert = false;
        });
    },

    resetValidation() {
      this.$refs.formOrderRequest?.reset();
    },

    onPaginationClick(page) {
      this.page = page;
      this.getAccounts();
    },

    minusQuentity(item) {
      if (item.isInsert) return;

      let quentity = parseInt(item.countChekBook) - 1;

      if (quentity < 1) return;
      item.countChekBook = quentity;
    },
    addQuentity(item) {
      if (item.isInsert) return;

      let quentity = parseInt(item.countChekBook) + 1;

      if (
        item.requestQuantity != null &&
        quentity > parseInt(item.requestQuantity)
      )
        return;

      item.countChekBook = quentity;
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style scoped>
.v-input input {
  max-height: 32px;
  text-align: center;
}
</style>
