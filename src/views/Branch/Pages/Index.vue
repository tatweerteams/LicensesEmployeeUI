<template>
  <div>
    <template v-if="itemBranchWorkTime">
      <BranchWorkTimeComponent
        :itemBranchWorkTimeProp="itemBranchWorkTime"
      ></BranchWorkTimeComponent>
    </template>

    <template v-if="itemBranchSetting">
      <BranchSettingComponent
        :itemBranchSettingProp="itemBranchSetting"
      ></BranchSettingComponent>
    </template>

    <template v-if="itemDelete">
      <DeleteComponent :deleteItemProp="itemDelete"></DeleteComponent>
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
        :items="branchs"
        hide-default-footer
        dense
        class="elevation-5 pa-5"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>إدارة الــفــروع</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-spacer />

            <UpdateAllWorkTimeComponent></UpdateAllWorkTimeComponent>

            <template
              v-if="
                hasPermassion([
                  'AdminSystem',
                  'AddOrUpdateBranch',
                  'AddBranchOtherRegions',
                ])
              "
            >
              <InsertOrUpdateComponent
                :updateItemProp="updateItem"
              ></InsertOrUpdateComponent>
            </template>
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
                  @click="activationBranch(item)"
                ></v-switch>
              </div>
            </template>
            <span>تفعيل و إلغاء تفعيل الفرع</span>
          </v-tooltip>
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                fab
                color="#536DFE"
                v-bind="attrs"
                v-on="on"
                @click="editItem(item)"
                :disabled="
                  !hasPermassion([
                    'AdminSystem',
                    'AddOrUpdateBranch',
                    'AddBranchOtherRegions',
                  ])
                "
              >
                <v-icon color="#fff">mdi-text-box-edit</v-icon>
              </v-btn>
            </template>
            <span>تعديل بيانات الفرع</span>
          </v-tooltip>

          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="mx-2"
                x-small
                fab
                color="#536DFE"
                v-bind="attrs"
                v-on="on"
                @click="showSetting(item)"
                :disabled="
                  !hasPermassion([
                    'AdminSystem',
                    'SettingBranch',
                    'AddBranchOtherRegions',
                  ])
                "
              >
                <v-icon color="#fff">mdi-cog-outline</v-icon>
              </v-btn>
            </template>
            <span>إعدادات الفرع</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                x-small
                fab
                color="#536DFE"
                v-bind="attrs"
                v-on="on"
                @click="showWorkTime(item)"
                :disabled="
                  !hasPermassion([
                    'AdminSystem',
                    'BranchWorkTime',
                    'AddBranchOtherRegions',
                  ])
                "
              >
                <v-icon color="#fff">mdi-calendar-clock</v-icon>
              </v-btn>
            </template>
            <span>أوقات العمل الفرع</span>
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
                @click="deleteBranch(item)"
              >
                <v-icon color="#fff">mdi-delete</v-icon>
              </v-btn>
            </template>
            <span> إلغاء الفرع</span>
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
import { EventBus } from "../../../eventBus";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
import SearchComponent from "../Components/searchComponent.vue";
import InsertOrUpdateComponent from "../Components/InsertOrUpdateComponent.vue";
import DeleteComponent from "../Components/DeleteComponent.vue";
import BranchSettingComponent from "../Components/BranchSettingComponent.vue";
import BranchWorkTimeComponent from "../Components/BranchWorkTimeComponent.vue";
import UpdateAllWorkTimeComponent from "../Components/updateAllWorkTimeComponent.vue";

export default {
  name: "LayoutsDemosBaselineFlipped",
  props: {
    source: String,
  },
  components: {
    SearchComponent,
    InsertOrUpdateComponent,
    DeleteComponent,
    BranchSettingComponent,
    BranchWorkTimeComponent,
    UpdateAllWorkTimeComponent,
  },

  data: () => ({
    userPermasstion: [],
    headers: [
      { text: "المصرف", value: "bankName", sortable: false, align: "center" },

      {
        text: "رقم الفرع",
        value: "branchNo",
        sortable: false,
        align: "center",
      },

      {
        text: "إسم الفرع",
        value: "name",
        sortable: false,
        align: "center",
      },
      {
        text: "المنطقة",
        value: "branchRegionName",
        sortable: false,
        align: "center",
      },
      {
        text: "عدد الحسابات",
        value: "accountCount",
        sortable: false,
        align: "center",
      },
      {
        text: "عدد الطلبات",
        value: "orderRequestCount",
        sortable: false,
        align: "center",
      },
      {
        text: "حالة الفرع",
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
      bankId: "",
      branchRegionId: "",
      nameOrNumber: "",
      pageNo: 1,
      pageSize: 30,
    },

    updateItem: null,
    itemDelete: null,
    itemBranchSetting: null,
    itemBranchWorkTime: null,
  }),

  created() {
    this.initialize();

    EventBus.$on("refreshData", () => {
      this.initialize();
    });
    EventBus.$on("closeDialogUpdateBranch", () => {
      this.updateItem = null;
    });

    EventBus.$on("closeDialogDeleteBranch", () => {
      this.itemDelete = null;
    });

    EventBus.$on("closeDialogBranchSetting", () => {
      this.itemBranchSetting = null;
    });
    EventBus.$on("closeDialogBranchWorkTime", () => {
      this.itemBranchWorkTime = null;
    });
  },

  watch: {},

  computed: {
    ...mapFields("branchStore", {
      branchs: "branchs",
      branchNo: "editedItem.branchNo",
      name: "editedItem.name",
      pageCount: "pageCount",
    }),
  },

  methods: {
    ...mapActions({
      GetBranchsStore: "branchStore/GetBranchs",
      ActivationBranchStore: "branchStore/ActivationBranch",
    }),

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
        this.GetBranchsStore(this.filterData)
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

    activationBranch(item) {
      this.$store.dispatch("loading", true);
      this.ActivationBranchStore(item)
        .then(() => {
          this.initialize();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    deleteBranch(item) {
      this.itemDelete = item;
    },

    showWorkTime(item) {
      this.branchNo = item.branchNo;
      this.name = item.name;
      this.itemBranchWorkTime = item;
    },

    editItem(item) {
      this.updateItem = item;
    },

    showSetting(item) {
      this.branchNo = item.branchNo;
      this.name = item.name;
      this.itemBranchSetting = item;
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
