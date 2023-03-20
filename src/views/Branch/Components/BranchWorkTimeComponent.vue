<template>
  <v-dialog v-model="dialog" max-width="1000px" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">{{ titleDialog }}</span>
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
            <!-- <template v-else-if="isEmpty">
              <EmptyComponent
                message="تم إلغاء الفرع"
                iconProp="mdi-clock-time-five-outline"
              ></EmptyComponent>
            </template> -->
            <template v-else>
              <v-row>
                <v-col cols="8">
                  <v-data-table
                    :headers="headers"
                    :disable-pagination="true"
                    :items="branchWorkTimes"
                    hide-default-footer
                    class="elevation-1 "
                  >
                    <template v-slot:[`item.dayName`]="{ item }">
                      {{ ChangeNameDay(item) }}
                    </template>
                    <template v-slot:[`item.active`]="{ item }">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <div v-bind="attrs" v-on="on">
                            <v-switch
                              dense
                              color="#536DFE"
                              hide-details
                              class="justify-center text-center mb-4  d-inline-block"
                              :input-value="item.isActive"
                              @click="activationBranchWorkTime(item)"
                            ></v-switch>
                          </div>
                        </template>
                        <span>تفعيل أو إلغاء تفعيل التوقيت</span>
                      </v-tooltip>
                    </template>

                    <template v-slot:[`item.action`]="{ item }">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            x-small
                            fab
                            v-bind="attrs"
                            v-on="on"
                            color="#536DFE"
                            @click="editItem(item)"
                          >
                            <v-icon color="#fff">mdi-text-box-edit</v-icon>
                          </v-btn>
                        </template>
                        <span>تعديل التوقيت</span>
                      </v-tooltip>
                    </template>
                  </v-data-table>
                </v-col>
                <v-col cols="4" class="my-4">
                  <v-card elevation="2">
                    <v-card-text>
                      <v-row>
                        <v-col cols="12">
                          <v-subheader class="font-weight-bold">
                            تعديل توقيت يوم
                            <span class="mx-2" v-if="editedItem.id"
                              >( {{ ChangeNameDay(editedItem) }} )</span
                            ></v-subheader
                          >

                          <v-subheader class="font-weight-bold"
                            >بداية الدوام</v-subheader
                          >
                          <el-time-select
                            clearable
                            placeholder="بداية الدوام"
                            v-model="editedItem.timeStart"
                            :picker-options="{
                              start: '08:30',
                              step: '00:15',
                              end: '23:30',
                            }"
                          >
                          </el-time-select>
                          <v-subheader class="font-weight-bold"
                            >نهاية الدوام</v-subheader
                          >
                          <el-time-select
                            placeholder="نهاية الدوام"
                            v-model="editedItem.timeEnd"
                            :picker-options="{
                              start: '08:30',
                              step: '00:15',
                              end: '23:30',
                              minTime: editedItem.timeStart,
                            }"
                          >
                          </el-time-select>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions class="text-center justify-center my-5">
                      <v-btn
                        @click="save"
                        class="mx-2 white--text"
                        color="#536DFE"
                        :disabled="!editedItem.id"
                      >
                        <v-icon>save</v-icon>
                        <span>حفظ</span>
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
            </template>
          </v-form>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <div style="width: 100%;text-align: center;">
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
// import EmptyComponent from "../../SharedComponents/EmptyComponent.vue";

import { DayweekEnum } from "../../../models/enum.js";
export default {
  name: "branch-setting",
  props: {
    itemBranchWorkTimeProp: {},
  },
  components: {
    // EmptyComponent,
  },

  data: () => ({
    dialog: false,
    valid: false,

    isLoading: true,

    filterBranchWorkTime: {
      branchId: null,
    },

    headers: [
      {
        text: "أيام الأسيوع",
        value: "dayName",
        sortable: false,
        align: "center",
      },
      {
        text: "بداية الدوام",
        value: "timeStart",
        sortable: false,
        align: "center",
      },
      {
        text: "نهاية الدوام",
        value: "timeEnd",
        sortable: false,
        align: "center",
      },
      {
        text: "الحالة",
        value: "active",
        sortable: false,
        align: "center",
      },
      {
        text: "تعديل التوقيت",
        value: "action",
        sortable: false,
        align: "center",
      },
    ],

    editedItem: {
      id: null,
      dayName: null,
      timeStart: null,
      timeEnd: null,
      isActive: false,
      branchId: null,
    },

    defaultItem: {
      id: null,
      dayName: null,
      timeStart: null,
      timeEnd: null,
      isActive: false,
      branchId: null,
    },
  }),

  computed: {
    ...mapFields("branchWorkTimeStore", {
      branchWorkTimes: "branchWorkTimes",
      isEmpty: "isEmpty",
    }),

    titleDialog() {
      return ` توقيت العمل ( ${this.itemBranchWorkTimeProp.name} ) رقم الفرع ( ${this.itemBranchWorkTimeProp.branchNo} )`;
    },
  },

  watch: {
    itemBranchWorkTimeProp: {
      handler(data) {
        if (data) this.editSelected(data);
      },
      immediate: true,
    },
  },
  methods: {
    ...mapActions({
      GetBranchWorkTime: "branchWorkTimeStore/GetBranchWorkTime",
      UpdateBranchWorkTime: "branchWorkTimeStore/UpdateBranchWorkTime",
      ActivationBranchWorkTime: "branchWorkTimeStore/ActivationBranchWorkTime",
      ClearDataItemStore: "branchWorkTimeStore/ClearDataItem",
    }),

    ChangeNameDay(item) {
      switch (item.dayName) {
        case DayweekEnum.Sunday:
          return "الأحـــد";
        case DayweekEnum.Monday:
          return "الإثنيــن";
        case DayweekEnum.Tuesday:
          return "الــثلاثاء";
        case DayweekEnum.Wednesday:
          return "الإربــعاء";
        case DayweekEnum.Thursday:
          return "الخمـــيس";
        case DayweekEnum.Friday:
          return "الجمــعة";
        case DayweekEnum.Saturday:
          return "الــسـبت";
        default:
          break;
      }
    },

    editSelected(item) {
      this.filterBranchWorkTime.branchId = item.id;
      this.dialog = true;
      this.getBranchWorkTime();
    },

    getBranchWorkTime() {
      try {
        this.isLoading = true;
        this.GetBranchWorkTime(this.filterBranchWorkTime)
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
      EventBus.$emit("closeDialogBranchWorkTime");
    },

    editItem(item) {
      this.editedItem = Object.assign({}, item);
    },

    save() {
      this.isLoading = true;
      this.UpdateBranchWorkTime(this.editedItem)
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.editedItem = Object.assign({}, this.defaultItem);
          this.getBranchWorkTime();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
    },

    activationBranchWorkTime(item) {
      this.ActivationBranchWorkTime(item)
        .then((res) => {
          this.notify(`${res}`, "#1d262d");
          this.getBranchWorkTime();
        })
        .catch((error) => {
          this.notify(`${error}`, "#1d262d");
          this.$store.dispatch("loading", false);
        });
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
