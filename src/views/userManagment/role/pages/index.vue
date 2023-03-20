<template>
  <div>
    <template v-if="itemDelete">
      <DeleteRoleComponent
        :deleteItemProp="itemDelete"
        @refresh-data="initialize"
        @close-dialog-delete="closeDialogDelete"
      ></DeleteRoleComponent>
    </template>
    <v-card
      min-height="40rem"
      color="transparent"
      elevation="0"
      height="auto"
      style="padding:30px; "
    >
      <searchRoleComponent @search-data="searchData"></searchRoleComponent>
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
            <v-toolbar-title>إدارة الأدوار</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer />

            <InsertOrUpdateComponent
              :updateItemProp="updateItem"
              @close-dialog-InsertOrUpdate="closeDialogInsertOrUpdate"
              @refresh-data="initialize"
            ></InsertOrUpdateComponent>
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
                  @click="activationRole(item)"
                ></v-switch>
              </div>
            </template>
            <span>تفعيل أو إلغاء تفعيل </span>
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
                fab
                v-bind="attrs"
                v-on="on"
                class="mx-1"
                color="#536DFE"
                @click="deleteItem(item)"
              >
                <v-icon color="#fff">mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>إلغاء الدور</span>
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
import searchRoleComponent from "../components/searchRoleComponent.vue";
import InsertOrUpdateComponent from "../components/insertOrUpdateRoleComponent.vue";
import DeleteRoleComponent from "../components/deleteRoleComponent.vue";

export default {
  name: "LayoutsDemosBaselineFlipped",
  props: {
    source: String,
  },
  components: {
    searchRoleComponent,
    InsertOrUpdateComponent,
    DeleteRoleComponent,
    // DeleteComponent,
    // BranchSettingComponent,
    // BranchWorkTimeComponent,
  },

  data: () => ({
    userPermasstion: [],
    headers: [
      { text: "اسم الدور", value: "name", sortable: false, align: "center" },
      {
        text: "التبعية المستخدمين",
        value: "userType",
        sortable: false,
        align: "center",
      },
      {
        text: "حالة الدور",
        value: "active",
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
      name: null,
      userType: null,
      pageNo: 1,
      pageSize: 30,
    },
    updateItem: null,
    itemDelete: null,
  }),

  created() {
    this.initialize();
  },

  watch: {},

  computed: {
    ...mapFields("roleStore", {
      grids: "grids",
      pageCount: "pageCount",
    }),
  },

  methods: {
    ...mapActions({
      GetRoles: "roleStore/GetRoles",
      ActivationRole: "roleStore/ActivationRole",
    }),

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

    closeDialogDelete() {
      this.itemDelete = null;
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
        this.GetRoles(this.filterData)
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

    activationRole(item) {
      this.$store.dispatch("loading", true);
      this.ActivationRole(item)
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
    deleteItem(item) {
      this.itemDelete = item;
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
