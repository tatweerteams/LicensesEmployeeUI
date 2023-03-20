<template>
  <div>
    <v-card min-height="40rem" color="transparent" elevation="0" height="auto" style="padding:30px; ">
      <SearchComponent @search-data="searchData"></SearchComponent>

      <template v-if="itemDelete">
        <DeleteAccountComponent @close-delete-dialog="closeDialogDelete" @refresh-data="initialize"
          :deleteItemProp="itemDelete">
        </DeleteAccountComponent>
      </template>

      <v-data-table :headers="headers" :disable-pagination="true" :items="accounts" hide-default-footer
        class="elevation-5 pa-5">
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>إعدادات الحسابات</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer />
            <template v-if="hasPermassion(['AdminSystem', 'AddOrUpdateAccounts'])">
              <InsertOrUpdateComponent :dialogProp="dialogEdit" @refresh-data="initialize"
                @close-edit-account="closeDialogEdit" :updateItemProp="itemToEdit">
              </InsertOrUpdateComponent>

              <UploadExcelComponent :dlgInsertFileProp="dialogUploadFile">
              </UploadExcelComponent>
            </template>
          </v-toolbar>
        </template>

        <template v-slot:[`item.accountStateValue`]="{ item }">
          <v-switch dense color="#536DFE" class="justify-center text-center mr-3 d-inline-block"
            :input-value="AccountStatusToText(item.accountStateValue)" @change="activateAccount(item)"
            :disabled="!hasPermassion(['AdminSystem', 'AddOrUpdateAccounts'])">
          </v-switch>
        </template>

        <template v-slot:[`item.printExternally`]="{ item }">
          <v-switch dense color="#536DFE" class="justify-center text-center mr-3 d-inline-block"
            :disabled="!hasPermassion(['AdminSystem', 'AddOrUpdateAccounts'])" :input-value="item.printExternally"
            @change="ativatePrintExternally(item)">
          </v-switch>
        </template>

        <template v-slot:[`item.accountTypeValue`]="{ item }">
          {{ accountTypeToText(item.accountTypeValue) }}
        </template>

        <template v-slot:[`item.action`]="{ item }">
          <v-btn x-small fab color="#536DFE" @click="editItem(item)"
            :disabled="!hasPermassion(['AdminSystem', 'AddOrUpdateAccounts'])">
            <v-icon color="#fff">mdi-text-box-edit</v-icon>
          </v-btn>
          <v-btn class="mx-2" x-small fab color="#EDEDED" @click="deleteItem(item)"
            :disabled="!hasPermassion(['AdminSystem', 'AddOrUpdateAccounts'])">
            <v-icon color="#E91D62">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>

      <template class="mt-5">
        <div class="text-center mt-3">
          <v-pagination v-model="page" :length="pageSize" circle color="#081D38" @input="onPaginationClick"
            :total-visible="7">
          </v-pagination>
        </div>
      </template>
    </v-card>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import {
  OrderRequestTypeToTextPublic,
  AccountStatusToText,
} from "../../../models/mothedPublic.js";
import { createHelpers } from "vuex-map-fields";
import SearchComponent from "../Components/searchComponent.vue";
import InsertOrUpdateComponent from "../Components/InsertOrUpdateComponent.vue";
import DeleteAccountComponent from "../Components/deleteAccountComponent.vue";

import UploadExcelComponent from "../Components/uploadExcelComponent.vue";

const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

export default {
  name: "LayoutsDemosBaselineFlipped",
  props: {
    source: String,
  },
  components: {
    SearchComponent,
    InsertOrUpdateComponent,
    DeleteAccountComponent,
    UploadExcelComponent,
  },

  data: () => ({
    userPermasstion: [],
    headers: [
      {
        text: "رقم الحساب",
        value: "accountNo",
        sortable: false,
        align: "center",
      },
      {
        text: "اسم الحساب",
        value: "accountName",
        sortable: false,
        align: "center",
      },
      { text: "المصرف", value: "bankName", sortable: false, align: "center" },
      {
        text: "المنطقة",
        value: "regionName",
        sortable: false,
        align: "center",
      },
      { text: "الفرع", value: "branchName", sortable: false, align: "center" },
      {
        text: "نوع الحساب",
        value: "accountTypeValue",
        sortable: false,
        align: "center",
      },
      {
        text: "حالة الحساب",
        value: "accountStateValue",
        sortable: false,
        align: "center",
      },
      { text: "طباعة خارج ", value: "printExternally", sortable: false, align: "center", },
      { text: "الإجراءات", value: "action", sortable: false, align: "center" },
    ],

    dialogUploadFile: false,

    accountTypeToText: OrderRequestTypeToTextPublic,
    AccountStatusToText: AccountStatusToText,

    dialogDelete: false,
    itemDelete: null,

    itemToEdit: null,
    dialogEdit: false,

    page: 1,
    pageSize: 1,

    filterData: {
      nameOrNumber: null,
      bankId: null,
      accountType: 0,
      bankRegionId: null,
      branchId: null,
      pageNo: 1,
      pageSize: 30,
    },

    isLoading: false,
  }),

  created() {
    this.initialize();
  },

  computed: {
    ...mapFields("accountStore", {
      accounts: "grids",
      pageCount: "pageCount",
    }),
  },

  methods: {
    ...mapActions({
      GetAccounts: "accountStore/GetAccounts",
      ActivateAccountStore: "accountStore/ActivateAccount",
      ActivatePrintExternallyStore: "accountStore/ActivatePrintExternally",
      GetBanksStore: "bankStore/GetBanks",
    }),

    hasPermassion(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },

    closeDialogEdit() {
      this.itemToEdit = null;
    },

    closeDialogDelete() {
      this.itemDelete = null;
    },

    activateAccount(item) {
      this.$store.dispatch("loading", true);
      this.ActivateAccountStore(item)
        .then(() => {
          this.$store.dispatch("loading", false);
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    ativatePrintExternally(item) {
      this.$store.dispatch("loading", true);
      this.ActivatePrintExternallyStore(item)
        .then(() => {
          this.$store.dispatch("loading", false);
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    searchData(filter) {
      this.page = 1;
      this.filterData = filter;
      this.initialize();
    },

    searchFieldsAreEmpty() {
      if (
        this.filterData.nameOrNumber == null &&
        this.filterData.bankId == null &&
        this.filterData.branchId == null
      ) {
        return true;
      } else {
        return false;
      }
    },

    initialize() {
      this.loadAccounts();
    },

    loadAccounts() {
      try {
        this.filterData.pageNo = this.page;

        this.$store.dispatch("loading", true);
        this.GetAccounts(this.filterData)
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

    deleteItem(item) {
      this.dialogDelete = true;
      this.itemDelete = item;
    },

    editItem(item) {
      this.itemToEdit = item;
      this.dialogEdit = true;
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
}
</style>
>
