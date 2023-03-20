<template>
  <div>
    <v-card
      min-height="40rem"
      color="transparent"
      elevation="0"
      height="auto"
      style="padding:30px; "
    >
      <v-data-table
        :headers="headers"
        :disable-pagination="true"
        :items="bankRegions"
        hide-default-footer
        class="elevation-5 pa-5"
      >
        <template v-slot:top>
          <v-toolbar flat color="white">
            <v-toolbar-title>إعدادات مناطق الفروع</v-toolbar-title>
            <v-divider class="mx-4" inset vertical></v-divider>
            <v-row class="px-5">
              <v-col dense cols="12" md="4" sm="6">
                <v-text-field
                  v-model="searchName"
                  label="اسم المنطقة أو رقم المنطقة"
                  clearable
                  prepend-icon="search"
                ></v-text-field>
              </v-col>
              <v-col
                cols="12"
                md="4"
                sm="6"
                v-if="hasPermassion(['AdminSystem'])"
              >
                <v-autocomplete
                  v-model="selectedBank"
                  :items="banks"
                  :loading="isLoading"
                  single-line
                  :search-input.sync="searchBank"
                  item-text="name"
                  item-value="bankId"
                  label="اختر المصرف"
                  placeholder="بحث عن طريق المصرف"
                  return-object
                  no-data-text="قم بالبحث علي اسم المصرف"
                  clearable
                  @keyup="getBanks"
                  @change="getRegionByBankId"
                ></v-autocomplete>
              </v-col>
            </v-row>
          </v-toolbar>
        </template>

        <template v-slot:[`item.regionNumber`]="{ item }">
          <v-avatar
            size="40"
            :color="item.isActive ? '#536DFE' : '#C5C5C5'"
            :class="item.isActive ? 'white--text elevation-5' : 'elevation-5'"
            >{{ item.regionNumber }}</v-avatar
          >
        </template>
        <template v-slot:[`item.action`]="{ item }">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on">
                <v-switch
                  color="#536DFE"
                  class="justify-center text-center  d-inline-block"
                  :input-value="item.isActive"
                  @click="activationBankRagion(item)"
                ></v-switch>
              </div>
            </template>
            <span>تفعيل أو إلغاء تفعيل</span>
          </v-tooltip>
        </template>

        <template v-slot:no-data>
          <v-btn color="primary" @click="initialize">عرض البيانات</v-btn>
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

export default {
  name: "LayoutsDemosBaselineFlipped",
  props: {
    source: String,
  },
  components: {},

  data: () => ({
    userPermasstion: [],
    headers: [
      {
        text: "رقم المنطقة",
        value: "regionNumber",
        sortable: true,
        align: "center",
      },

      {
        text: "اسم المصرف",
        value: "bankName",
        sortable: true,
        align: "center",
      },

      {
        text: "إسم المنطقة",
        value: "regionName",
        sortable: true,
        align: "center",
      },
      // { text: "رقم المصرف", value: "bankNo", sortable: true, align: "center" },
      {
        text: "عدد فروع المنطقة",
        value: "branchCount",
        sortable: false,
        align: "center",
      },
      {
        text: "حالة المنطقة",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],

    page: 1,
    pageSize: 1,

    filterData: {
      bankId: "",
      regionName: "",
      regionNo: "",
      pageNo: 1,
      pageSize: 30,
    },

    isLoading: false,
    selectedBank: null,
    searchBank: null,
    filterBankData: {
      bankName: null,
    },

    searchName: "",
  }),

  created() {
    this.initialize();
  },

  watch: {
    searchName(val) {
      this.filterData.regionName = val;
      this.page = 1;
      this.initialize();
    },
    searchBank(val) {
      if (this.isLoading) return;
      this.filterBankData.bankName = val;
    },
  },

  computed: {
    ...mapFields("bankRegionStore", {
      bankRegions: "bankRegions",
    }),
    ...mapFields("bankStore", {
      banks: "grids",
    }),
  },

  methods: {
    ...mapActions({
      ActivateBankRegionStore: "bankRegionStore/ActivationBankRegion",
      GetBankRegionStore: "bankRegionStore/GetBankRegions",
      GetBanksStore: "bankStore/GetBanks",
    }),
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
        this.GetBankRegionStore(this.filterData)
          .then(() => {
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
    getRegionByBankId() {
      this.filterData.bankId = this.selectedBank?.bankId;
      this.initialize();
    },
    getBanks() {
      try {
        this.isLoading = true;
        this.GetBanksStore(this.filterBankData)
          .then(() => {
            this.isLoading = false;
          })
          .catch((error) => {
            this.notify(`${error}`, "#1d262d");
            this.isLoading = false;
          });
      } catch (error) {
        this.isLoading = false;
        this.notify(error, "#1d262d");
      }
    },

    activationBankRagion(item) {
      this.$store.dispatch("loading", true);
      this.ActivateBankRegionStore(item)
        .then(() => {
          this.initialize();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
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
