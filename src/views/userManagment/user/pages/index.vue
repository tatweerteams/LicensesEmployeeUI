<template>
  <div>
    <template v-if="resetPasswordItem">
      <ResetPasswordComponent
        :resetPasswordItemProp="resetPasswordItem"
        @close-dialog-ResetPassword="closeDialogResetPassword"
        @refresh-data="initialize"
      ></ResetPasswordComponent>
    </template>

    <v-card
      min-height="40rem"
      color="transparent"
      elevation="0"
      height="auto"
      style="padding:30px; "
    >
      <SearchUserComponent @search-data="searchData"></SearchUserComponent>
      <v-data-table
        :headers="headers"
        :disable-pagination="true"
        :items="grids"
        hide-default-footer
        dense
        class="elevation-5 pa-5"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>إدارة المستخدمين</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer />

            <InsertOrUpdateUserComponent
              :updateItemProp="updateItem"
              @close-dialog-InsertOrUpdate="closeDialogInsertOrUpdate"
              @refresh-data="initialize"
            ></InsertOrUpdateUserComponent>
          </v-toolbar>
        </template>

        <template v-slot:[`item.active`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-switch
                  dense
                  color="#536DFE"
                  hide-details
                  class="justify-center text-center  mb-4 d-inline-block"
                  :input-value="item.isActive"
                  @click="activationUser(item)"
                ></v-switch>
              </div>
            </template>
            <span>تفعيل أو إلغاء تفعيل</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                v-bind="attrs"
                v-on="on"
                fab
                color="#536DFE"
                @click="editItem(item)"
              >
                <v-icon color="#fff">mdi-text-box-edit</v-icon>
              </v-btn>
            </template>
            <span>تعديل بيانات</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                class="mx-1"
                fab
                v-bind="attrs"
                v-on="on"
                color="#536DFE"
                @click="resetPassword(item)"
              >
                <v-icon color="#fff">mdi-lock-reset</v-icon>
              </v-btn>
            </template>
            <span>ضبط كلمة المرور</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.userType`]="{ item }">
          {{ userTypeStateToText(item.userType) }}
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
import { UserTypeStateToTextPublic } from "../../../../models/mothedPublic.js";
import { mapActions } from "vuex";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

import SearchUserComponent from "../components/searchUserComponent.vue";
import InsertOrUpdateUserComponent from "../components/insertOrUpdateUserComponent.vue";
import ResetPasswordComponent from "../components/resetPasswordComponent.vue";
// import InsertOrUpdateComponent from "../components/insertOrUpdateRoleComponent.vue";

export default {
  name: "LayoutsDemosBaselineFlipped",
  props: {
    source: String,
  },
  components: {
    SearchUserComponent,
    InsertOrUpdateUserComponent,
    ResetPasswordComponent,
  },

  data: () => ({
    userPermasstion: [],
    headers: [
      {
        text: "رقم الوظيفي",
        value: "employeeNumber",
        sortable: false,
        align: "center",
      },
      { text: "اسم الموظف", value: "name", sortable: false, align: "center" },

      {
        text: "الفرع",
        value: "branchName",
        sortable: false,
        align: "center",
      },
      {
        text: "رقم الهاتف",
        value: "phoneNumber",
        sortable: false,
        align: "center",
      },
      {
        text: "التبعية المستخدم",
        value: "userType",
        sortable: false,
        align: "center",
      },
      {
        text: "اسم الدور",
        value: "roleName",
        sortable: false,
        align: "center",
      },
      {
        text: "حالة المستخدم",
        value: "active",
        sortable: false,
        align: "center",
      },
      {
        text: " الإجراءات",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],

    page: 1,
    pageSize: 1,

    filterData: {
      name: null,
      userType: null,
      branchId: null,
      regionId: null,
      phoneNumber: null,
      employeeNo: null,
      pageNo: 1,
      pageSize: 30,
    },
    updateItem: null,
    resetPasswordItem: null,
  }),

  created() {
    this.initialize();
  },

  watch: {},

  computed: {
    ...mapFields("userStore", {
      grids: "grids",
      pageCount: "pageCount",
    }),
  },

  methods: {
    ...mapActions({
      GetUsers: "userStore/GetUsers",
      ActivationUser: "userStore/ActivationUser",
    }),

    hasPermassion(crrentUser) {
      this.userPermasstion = this.$store.getters["auth/getRole"];
      var result = this.userPermasstion.some((item) =>
        crrentUser.includes(item)
      );
      return result;
    },

    userTypeStateToText(userType) {
      return UserTypeStateToTextPublic(userType);
    },

    searchData(filter) {
      this.page = 1;
      this.filterData = filter;
      this.initialize();
    },
    closeDialogInsertOrUpdate() {
      this.updateItem = null;
    },

    closeDialogResetPassword() {
      this.resetPasswordItem = null;
    },
    resetPassword(item) {
      this.resetPasswordItem = item;
    },

    initialize() {
      try {
        this.filterData.pageNo = this.page;
        this.$store.dispatch("loading", true);
        this.GetUsers(this.filterData)
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

    activationUser(item) {
      const param = {
        userId: item.id,
        isActive: item.isActive,
      };
      this.$store.dispatch("loading", true);
      this.ActivationUser(param)
        .then(() => {
          this.initialize();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    editItem(item) {
      this.updateItem = item;
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
