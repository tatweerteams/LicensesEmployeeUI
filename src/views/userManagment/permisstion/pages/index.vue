<template>
  <div>
    <!-- <template v-if="itemBranchWorkTime">
      <BranchWorkTimeComponent
        :itemBranchWorkTimeProp="itemBranchWorkTime"
      ></BranchWorkTimeComponent>
    </template> -->

    <!-- <template v-if="itemBranchSetting">
      <BranchSettingComponent
        :itemBranchSettingProp="itemBranchSetting"
      ></BranchSettingComponent>
    </template>

    <template v-if="itemDelete">
      <DeleteComponent :deleteItemProp="itemDelete"></DeleteComponent>
    </template> -->
    <v-card
      min-height="40rem"
      color="transparent"
      elevation="0"
      height="auto"
      style="padding:30px; "
    >
      <SearchPermisstionComponent
        @search-data="searchData"
      ></SearchPermisstionComponent>
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
            <v-toolbar-title>إدارة الصلاحيات</v-toolbar-title>
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
                  @click="activationPermisstion(item)"
                ></v-switch>
              </div>
            </template>
            <span> تفعيل و إلغاء تفعيل الصلاحية</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-bind="attrs"
                v-on="on"
                x-small
                fab
                color="#536DFE"
                @click="editItem(item)"
              >
                <v-icon color="#fff">mdi-text-box-edit</v-icon>
              </v-btn>
            </template>
            <span>تعديل الصلاحية</span>
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
import { EventBus } from "../../../../eventBus";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
import SearchPermisstionComponent from "../components/searchPermisstionComponent.vue";
import InsertOrUpdateComponent from "../components/insertOrUpdateComponent.vue";
// import InsertOrUpdateComponent from "../Components/InsertOrUpdateComponent.vue";
// import DeleteComponent from "../Components/DeleteComponent.vue";
// import BranchSettingComponent from "../Components/BranchSettingComponent.vue";
// import BranchWorkTimeComponent from "../Components/BranchWorkTimeComponent.vue";

export default {
  name: "LayoutsDemosBaselineFlipped",
  props: {
    source: String,
  },
  components: {
    SearchPermisstionComponent,
    InsertOrUpdateComponent,
    // DeleteComponent,
    // BranchSettingComponent,
    // BranchWorkTimeComponent,
  },

  data: () => ({
    userPermasstion: [],
    headers: [
      { text: "اسم الصلاحية", value: "name", sortable: false, align: "center" },
      {
        text: "وصف الصلاحية",
        value: "description",
        sortable: false,
        align: "center",
      },
      {
        text: "حالة الصلاحية",
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
  }),

  created() {
    this.initialize();

    EventBus.$on("refreshData", () => {
      this.initialize();
    });
  },

  watch: {},

  computed: {
    ...mapFields("permisstionStore", {
      grids: "grids",
      pageCount: "pageCount",
    }),
  },

  methods: {
    ...mapActions({
      GetPermisstions: "permisstionStore/GetPermisstions",
      ActivationPermisstion: "permisstionStore/ActivationPermisstion",
    }),

    searchData(filter) {
      this.page = 1;
      this.filterData = filter;
      this.initialize();
    },
    closeDialogInsertOrUpdate() {
      this.updateItem = null;
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
        this.GetPermisstions(this.filterData)
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

    activationPermisstion(item) {
      this.$store.dispatch("loading", true);
      this.ActivationPermisstion(item)
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
