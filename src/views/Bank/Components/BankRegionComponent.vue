<template>
  <v-dialog v-model="dialog" max-width="600px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="formBank" v-model="valid">
            <v-row dense>
              <v-col cols="12" dense>
                <v-select
                  v-model="selectedRegion"
                  :items="regions"
                  label="اختر المنطقة"
                  placeholder="إختر منطقة للمصرف"
                  :rules="regionRules"
                  required
                  item-text="regionName"
                  item-value="regionId"
                  single-line
                  :search-input.sync="searchRegion"
                  @keyup="getRegions"
                  dense
                  clearable
                  chips
                  return-object
                  persistent-hint
                ></v-select>
              </v-col>
              <v-col dense cols="12" class="text-center justify-center">
                <v-btn
                  @click="save"
                  :disabled="!valid"
                  color="#536DFE"
                  class="white--text px-15 "
                >
                  <v-icon style="font-size: 19px; color:#fff">save</v-icon>
                  <span>إضافة</span>
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-container>

        <v-container>
          <template v-if="isLoading">
            <v-row>
              <v-col cols="12" class="justify-center text-center">
                <v-progress-circular color="blue" indeterminate>
                </v-progress-circular>
                <span class="mx-5">الرجاء الانتظار</span>
              </v-col>
            </v-row>
          </template>
          <template v-else>
            <ShowBankRegionComponent></ShowBankRegionComponent>
          </template>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center;">
          <v-btn class="mx-2 px-10 white--text"  @click="close" color="#E91D62">
            <v-icon style="font-size: 19px;" dark>clear</v-icon>
            <span>إلغاء</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from "../../../eventBus.js";
import ShowBankRegionComponent from "../Components/ShowDataBankRegionComponent.vue";
import { mapActions } from "vuex";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
export default {
  name: "insert-Or-Update",
  props: {
    selectedItemProp: {},
    dialogProp: {},
  },
  components: {
    ShowBankRegionComponent,
  },

  data: () => ({
    dialog: false,
    valid: false,
    isLoading: false,
    regionRules: [(v) => !!v || "الرجاء اختيار منطقة"],

    selectedRegion: null,
    searchRegion: null,
    filterDataRegion: {
      regionName: null,
      bankId: null,
    },

    insertItem: {
      bankId: null,
      regionId: null,
    },
    insertItemDefualt: {
      bankId: null,
      regionId: null,
    },
  }),

  created() {
    EventBus.$on("refreshRegions", () => {
      this.close();
    });

  },

  computed: {
    ...mapFields("regionStore", {
      regions: "regionUnSelectBank",
    }),
    ...mapFields("bankRegionStore", {
      bankRegions: "bankRegions",
    }),
    formTitle() {
      return `إعدادات المناطق ${this.selectedItemProp?.name}`;
    },
  },

  watch: {
    dialogProp: {
      handler(data) {
        this.dialog = data;
      },
      immediate: true,
    },

    selectedItemProp: {
      handler(data) {
        if (data) this.editSelected(data);
      },
      immediate: true,
    },
    // searchRegion(data) {
    //   this.filterDataRegion.regionName = data;
    // },
  },
  methods: {
    ...mapActions({
      GetRegionStore: "regionStore/GetRegionsUnSelected",
      GetBankRegionStore: "bankRegionStore/GetBankRegions",
      InsertBankRegionStore: "bankRegionStore/InsertBankRegion",
    }),

    clearData() {
      this.selectedRegion = null;
      this.searchRegion = null;
      this.filterDataRegion.regionName = null;
      this.insertItem.regionId = null;
      this.resetValidation();
    },

    getRegions() {
      this.GetRegionStore(this.filterDataRegion)
        .then(() => {})
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
        });
    },
    getBankRegions() {
      this.isLoading = true;
      this.GetBankRegionStore(this.filterDataRegion)
        .then(() => {
          this.isLoading = false;
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.isLoading = false;
        });
    },

    editSelected(item) {
      this.filterDataRegion.bankId = item.bankId;
      this.insertItem.bankId = item.bankId;
      this.reafershData();
      this.dialog = true;
    },

    reafershData() {
      this.getBankRegions();
      this.getRegions();
    },

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.clearData();
      }, 300);

      EventBus.$emit("closeDialogBankRegion");
    },

    save() {
      this.insertBankRegion();
    },

    insertBankRegion() {
      this.insertItem.regionId = this.selectedRegion
        ? this.selectedRegion.regionId
        : null;

      this.$store.dispatch("loading", true);
      this.InsertBankRegionStore(this.insertItem)
        .then(() => {
          this.clearData();
          this.reafershData();
          this.$store.dispatch("loading", false);
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    resetValidation() {
      this.$refs.formBank?.reset();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
