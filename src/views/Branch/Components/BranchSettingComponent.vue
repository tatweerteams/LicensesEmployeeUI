<template>
  <v-dialog v-model="dialog" max-width="800px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">{{ titleSetting }}</span>
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text>
        <v-container>
          <v-form ref="formBranchSetting" v-model="valid">
            <template v-if="isLoading">
              <v-row>
                <v-col cols="12" class="text-center">
                  <v-progress-circular
                    indeterminate
                    size="25"
                    width="2"
                    color="#536DFE"
                  >
                  </v-progress-circular>
                  جاري جلب الإعدادات
                </v-col>
              </v-row>
            </template>
            <template v-else-if="isEmpty">
              <EmptyComponent
                message="لايوجد إعدادات للفرع"
                iconProp="mdi-cog-off-outline"
              ></EmptyComponent>
            </template>
            <template v-else>
              <BranchSettingComponent></BranchSettingComponent>
            </template>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center;">
          <v-btn
            @click="save"
            class="mx-2 white--text"
            :disabled="!valid || isLoading || isEmpty"
            color="#536DFE"
          >
            <v-icon>save</v-icon>
            <span>حفظ الإعدادات</span>
          </v-btn>
          <v-btn class="mx-2 white--text" @click="close" color="#E91D62">
            <v-icon dark>clear</v-icon>
            <span>إلغاء</span>
          </v-btn>
        </div>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { EventBus } from "../../../eventBus.js";
import { mapActions } from "vuex";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getDataFields",
  mutationType: "updateDataField",
});
import BranchSettingComponent from "../../SharedComponents/branchSettingComponent.vue";
import EmptyComponent from "../../SharedComponents/EmptyComponent.vue";
export default {
  name: "branch-setting",
  props: {
    itemBranchSettingProp: {},
  },
  components: {
    BranchSettingComponent,
    EmptyComponent,
  },

  data: () => ({
    dialog: false,
    valid: false,

    isLoading: true,

    filterBranchSettingData: {
      branchSettingId: null,
    },
  }),

  computed: {
    ...mapFields("branchStore", {
      isEmpty: "isEmpty",
      branchNo: "editedItem.branchNo",
      name: "editedItem.name",
    }),

    titleSetting() {
      return `إعدادات الفرع ( ${this.name} ) رقم الفرع ( ${this.branchNo} )`;
    },
  },

  watch: {
    itemBranchSettingProp: {
      handler(data) {
        if (data) this.editSelected(data);
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      ClearDataItemStore: "branchStore/ClearDataItem",
      //   SetDataUpdateStore: "branchStore/SetDataUpdate",
      GetBranchSetting: "branchStore/GetBranchSetting",
      UpdateBranchSetting: "branchStore/UpdateBranchSetting",
    }),

    editSelected(item) {
      this.filterBranchSettingData.branchSettingId = item.branchSettingId;
      this.dialog = true;
      this.getBranchSetting();
    },

    getBranchSetting() {
      try {
        this.isLoading = true;
        this.GetBranchSetting(this.filterBranchSettingData)
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

    close() {
      this.dialog = false;
      setTimeout(() => {
        this.ClearDataItemStore();
        this.isLoading = true;
      }, 300);
      this.resetValidation();
      EventBus.$emit("closeDialogBranchSetting");
    },

    save() {
      this.$store.dispatch("loading", true);
      this.UpdateBranchSetting()
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          EventBus.$emit("refreshData");
          this.close();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
      //
    },

    resetValidation() {
      this.$refs.formBranchSetting?.reset();
    },

    notify(text, color) {
      this.$store.commit("showMessage", { text: text, color: color });
    },
  },
};
</script>

<style></style>
