<template>
  <div>
    <template v-if="itemDelete">
      <DeleteComponent
        :deleteItemProp="itemDelete"
        @close-dialog-delete="closeDialogDelete"
        @refresh-data="initialize"
      ></DeleteComponent>
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
        dense
        class="elevation-5 pa-5"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>إعدادات أسباب الرفض</v-toolbar-title>
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
                  @click="activationReasonRefuse(item)"
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
            <span>تعديل البيانات </span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-2"
                x-small
                fab
                v-bind="attrs"
                v-on="on"
                color="#E91D62"
                @click="showDeleteDialog(item)"
              >
                <v-icon color="#fff">mdi-delete</v-icon>
              </v-btn>
            </template>
            <span>إلغاء سبب الرفض</span>
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
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});

import InsertOrUpdateComponent from "../components/insertOrUpdateComponent.vue";
import DeleteComponent from "../components/deleteComponent.vue";
import SearchComponent from "../components/searchComponent.vue";

export default {
  name: "LayoutsDemosBaselineFlipped",
  props: {
    source: String,
  },
  components: {
    SearchComponent,
    InsertOrUpdateComponent,
    DeleteComponent,
  },

  data: () => ({
    userPermasstion: [],
    headers: [
      {
        text: "سبب الرفض",
        value: "name",
        sortable: false,
        align: "center",
        width: "500",
      },

      {
        text: "تاريخ الإنشاء",
        value: "createAt",
        sortable: false,
        align: "center",
      },

      {
        text: "رقم الموظف",
        value: "employeeNo",
        sortable: false,
        align: "center",
      },

      {
        text: "حالة سبب الرفض",
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
      name: "",
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
    ...mapFields("reasonRefuseStore", {
      grids: "grids",
      pageCount: "pageCount",
    }),
  },

  methods: {
    ...mapActions({
      GetReasonRefuses: "reasonRefuseStore/GetReasonRefuses",
      ActivationReasonRefuse: "reasonRefuseStore/ActivationReasonRefuse",
    }),

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
        this.GetReasonRefuses(this.filterData)
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

    activationReasonRefuse(item) {
      this.$store.dispatch("loading", true);
      this.ActivationReasonRefuse(item)
        .then(() => {
          this.initialize();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    showDeleteDialog(item) {
      this.itemDelete = item;
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
